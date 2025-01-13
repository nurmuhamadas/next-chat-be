import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import InvariantError from "@/common/exceptions/invariant-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { AttachmentEntity } from "@/domains/messages/entities/attachment-entity"
import { CreateMessageEntity } from "@/domains/messages/entities/create-message-entity"
import { MessageEntity } from "@/domains/messages/entities/message-entity"
import { MessageRepository } from "@/domains/messages/repositories/message-repository"
import { StorageRepository } from "@/domains/storage/repositories/storage-repository"
import { KEYS } from "@/infrastuctures/container/keys"

/**
 * RULES:
 * - Must be a channel admin
 * - update the room's last message for all subscribers
 * - update sender last message read
 */
@injectable()
export class CreateChannelMessage {
  constructor(
    @inject(KEYS.MessageRepository)
    private messageRepository: MessageRepository,
    @inject(KEYS.StorageRepository)
    private storageRepository: StorageRepository,
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    data: CreateMessageEntity,
    attachments: File[] = [],
  ): Promise<MessageEntity> {
    if (!data.groupId) {
      throw new InvariantError(ERROR.INVALID_TYPE, ["roomType"])
    }

    const channel = await this.channelRepository.getPublicOrJoinedChannelById(
      data.groupId,
      session.userId,
    )
    if (!channel) {
      throw new InvariantError(ERROR.GROUP_NOT_FOUND, ["receiverId"])
    }

    if (!channel.isSubscriber) {
      throw new AuthorizationError(ERROR.NOT_GROUP_MEMBER)
    }

    const parentMessage = data.parentMessageId
      ? await this.messageRepository.getMessageById(data.parentMessageId)
      : undefined

    if (parentMessage) {
      if (!parentMessage) {
        throw new InvariantError(ERROR.MESSAGE_NOT_FOUND, ["parentMessageId"])
      }

      if (parentMessage.channelId !== channel.id) {
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
        data.userReceiverId!,
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
