import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { BlockedUserRepository } from "@/domains/blocked-users/repositories/blocked-user-repository"
import { AttachmentEntity } from "@/domains/messages/entities/attachment-entity"
import { CreateMessageEntity } from "@/domains/messages/entities/create-message-entity"
import { MessageEntity } from "@/domains/messages/entities/message-entity"
import { MessageRepository } from "@/domains/messages/repositories/message-repository"
import { PrivateChatRepository } from "@/domains/private-chat/repositories/private-chat-repository"
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
  ) {}

  async execute(
    session: SessionTokenEntity,
    data: CreateMessageEntity,
    attachments: File[] = [],
  ): Promise<MessageEntity> {
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
      const createdMessage = await this.messageRepository.createMessage(
        session.userId,
        message,
        parentMessage ?? undefined,
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
