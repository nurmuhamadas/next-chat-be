import { inject, injectable } from "inversify"

import { WebSocketManager } from "@/app/socket/web-socket-manager"
import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { BlockedUserRepository } from "@/domains/blocked-users/repositories/blocked-user-repository"
import { AttachmentEntity } from "@/domains/messages/entities/attachment-entity"
import { CreateMessageEntity } from "@/domains/messages/entities/create-message-entity"
import { MessageEntity } from "@/domains/messages/entities/message-entity"
import { MessageRepository } from "@/domains/messages/repositories/message-repository"
import { UnreadMessageRepository } from "@/domains/messages/repositories/unread-message-repository"
import { CreatePrivateChatEntity } from "@/domains/private-chat/entites/create-private-chat-entity"
import { UpdatePrivateChatOptionEntity } from "@/domains/private-chat/entites/update-private-chat-option-entity"
import { PrivateChatOptionRepository } from "@/domains/private-chat/repositories/private-chat-option-repository"
import { PrivateChatRepository } from "@/domains/private-chat/repositories/private-chat-repository"
import { CreateRoomEntity } from "@/domains/rooms/entities/create-room-entity"
import { RoomRepository } from "@/domains/rooms/repositories/room-repository"
import { StorageRepository } from "@/domains/storage/repositories/storage-repository"
import { KEYS } from "@/infrastuctures/container/keys"

/**
 * RULES:
 * - Cannot send a message if blocking the receiver
 * - Never contacted before:
 *   * create a private chat
 *   * create a room for both if not blocked
 *   * create a room for sender only if blocked
 *   * create private chat options for both
 *   * update sender last message read
 *
 * - Already have a private chat (have contacted before):
 *   * show the room if not blocked
 *   * create private chat options for both if not existing
 *   * update sender last message read
 *
 */
@injectable()
export class CreatePrivateMessage {
  constructor(
    @inject(KEYS.MessageRepository)
    private messageRepository: MessageRepository,
    @inject(KEYS.StorageRepository)
    private storageRepository: StorageRepository,
    @inject(KEYS.BlockedUserRepository)
    private blockedUserRepository: BlockedUserRepository,
    @inject(KEYS.PrivateChatRepository)
    private privateChatRepository: PrivateChatRepository,
    @inject(KEYS.PrivateChatOptionRepository)
    private privateChatOptionRepository: PrivateChatOptionRepository,
    @inject(KEYS.RoomRepository)
    private roomRepository: RoomRepository,
    @inject(KEYS.UnreadMessageRepository)
    private unreadMessageRepository: UnreadMessageRepository,
    @inject(KEYS.WebSocketManager)
    private webSocketManager: WebSocketManager,
  ) {}

  async execute(
    session: SessionTokenEntity,
    data: CreateMessageEntity,
    attachments: File[] = [],
  ): Promise<MessageEntity> {
    // VALIDATION
    if (!data.userReceiverId) {
      throw new InvariantError(ERROR.INVALID_TYPE, ["roomType"])
    }

    const isBlocking = await this.blockedUserRepository.getIsUserBlocked(
      session.userId,
      data.userReceiverId ?? "",
    )

    if (isBlocking) {
      throw new InvariantError(ERROR.CANNOT_SEND_MESSAGE_TO_BLOCKED_USER)
    }

    const parentMessage = data.parentMessageId
      ? await this.messageRepository.getMessageById(data.parentMessageId)
      : undefined

    if (parentMessage) {
      const privateChat = data.userReceiverId
        ? await this.privateChatRepository.getByUserIds(
            session.userId,
            data.userReceiverId,
          )
        : undefined

      if (!parentMessage) {
        throw new InvariantError(ERROR.MESSAGE_NOT_FOUND, ["parentMessageId"])
      }

      if (parentMessage.privateChatId !== privateChat?.id) {
        throw new InvariantError(ERROR.PARENT_MESSAGE_NOT_IN_ROOM)
      }
    }

    if (attachments.length > 0) {
      const files = await Promise.all(
        attachments.map((file) => this.storageRepository.uploadFile(file)),
      )

      data.attachments = files.map(
        (file) =>
          new AttachmentEntity(
            file.id,
            file.name,
            file.size,
            file.type,
            file.url,
            file.downloadUrl,
          ),
      )
    }

    try {
      const message = new CreateMessageEntity(
        data.userReceiverId,
        data.roomType,
        data.isEmojiOnly,
        data.message,
        data.parentMessageId,
        data.originalMessageId,
        data.attachments,
      )

      const isBlocked = await this.blockedUserRepository.getIsUserBlocked(
        data.userReceiverId,
        session.userId,
      )

      const privateChat = await this.privateChatRepository.getByUserIds(
        session.userId,
        data.userReceiverId,
      )
      if (!privateChat) {
        // NEVER CONTACT BEFORE
        const newPrivateChat = await this.privateChatRepository.create(
          new CreatePrivateChatEntity(session.userId, data.userReceiverId),
        )

        const createdMessage = await this.messageRepository.createMessage(
          session.userId,
          message,
          parentMessage ?? undefined,
          newPrivateChat.id,
        )

        await this.roomRepository.createRoom(
          new CreateRoomEntity(
            "PRIVATE",
            session.userId,
            0,
            createdMessage.id,
            newPrivateChat.id,
          ),
        )

        if (!isBlocked) {
          await this.roomRepository.createRoom(
            new CreateRoomEntity(
              "PRIVATE",
              data.userReceiverId,
              1,
              createdMessage.id,
              newPrivateChat.id,
            ),
          )
        } else {
          const option =
            await this.privateChatOptionRepository.getPrivateChatOptionByUserId(
              data.userReceiverId,
              session.userId,
            )
          await this.privateChatOptionRepository.updateOrCreatePrivateChatOption(
            option?.id ?? "",
            newPrivateChat.id,
            new UpdatePrivateChatOptionEntity(data.userReceiverId, false),
          )
        }

        const receivers = [session.userId]

        if (!isBlocked) {
          receivers.push(data.userReceiverId)
        }

        this.webSocketManager.broadcastMessage(
          JSON.stringify(createdMessage),
          receivers,
        )

        return createdMessage
      }

      // INTERACTED BEFORE

      const createdMessage = await this.messageRepository.createMessage(
        session.userId,
        message,
        parentMessage ?? undefined,
        privateChat.id,
      )

      const senderRoom = await this.roomRepository.getRoomByActionId(
        session.userId,
        data.userReceiverId,
      )

      const receiverRoom = await this.roomRepository.getRoomByActionId(
        data.userReceiverId,
        session.userId,
      )

      if (senderRoom) {
        await this.roomRepository.updateLastMessage(
          senderRoom?.id,
          createdMessage.id,
        )
      }

      if (!isBlocked && receiverRoom) {
        await this.roomRepository.updateLastMessage(
          receiverRoom.id,
          createdMessage.id,
        )
      }

      const senderOpt =
        await this.privateChatOptionRepository.getPrivateChatOptionByUserId(
          session.userId,
          data.userReceiverId,
        )
      await this.privateChatOptionRepository.updateOrCreatePrivateChatOption(
        senderOpt?.id ?? "",
        privateChat.id,
        new UpdatePrivateChatOptionEntity(data.userReceiverId, false),
      )

      if (createdMessage.sender.id !== data.userReceiverId) {
        const receiverOption =
          await this.privateChatOptionRepository.getPrivateChatOptionByUserId(
            data.userReceiverId,
            session.userId,
          )
        await this.privateChatOptionRepository.updateOrCreatePrivateChatOption(
          receiverOption?.id ?? "",
          privateChat.id,
          new UpdatePrivateChatOptionEntity(data.userReceiverId, false),
        )
      }

      if (createdMessage.sender.id !== data.userReceiverId && !isBlocked) {
        if (receiverRoom) {
          await this.unreadMessageRepository.incrementUnreadMessageCount(
            data.userReceiverId,
            session.userId,
          )
        }
      }

      const receivers = [session.userId]

      if (!isBlocked) {
        receivers.push(data.userReceiverId)
      }

      this.webSocketManager.broadcastMessage(
        JSON.stringify(createdMessage),
        receivers,
      )

      return createdMessage
    } catch (e) {
      if (data.attachments.length > 0) {
        await Promise.all(
          data.attachments.map((file) =>
            this.storageRepository.deleteFile(file.id),
          ),
        )
      }
      throw e
    }
  }
}
