import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { ChannelSubscriberRepository } from "@/domains/channels/repositories/channel-subscriber-repository"
import { GroupMemberRepository } from "@/domains/groups/repositories/group-member-repository"
import { MessageRepository } from "@/domains/messages/repositories/message-repository"
import { StorageRepository } from "@/domains/storage/repositories/storage-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class DeleteMessageByAdmin {
  constructor(
    @inject(KEYS.MessageRepository)
    private messageRepository: MessageRepository,
    @inject(KEYS.StorageRepository)
    private storageRepository: StorageRepository,
    @inject(KEYS.GroupMemberRepository)
    private groupMemberRepository: GroupMemberRepository,
    @inject(KEYS.ChannelSubscriberRepository)
    private channelSubscriberRepository: ChannelSubscriberRepository,
  ) {}

  async execute(session: SessionTokenEntity, messageId: string): Promise<void> {
    const originalMessage =
      await this.messageRepository.getMessageById(messageId)

    if (!originalMessage) {
      throw new NotFoundError(ERROR.MESSAGE_NOT_FOUND)
    }

    if (originalMessage.status !== "DEFAULT") {
      throw new InvariantError(ERROR.MESSAGE_ALREADY_DELETED)
    }

    if (originalMessage.groupId) {
      const isAdmin = this.groupMemberRepository.validateGroupAdmin(
        originalMessage.groupId,
        session.userId,
      )

      if (!isAdmin) {
        throw new AuthorizationError(ERROR.NOT_ALLOWED)
      }
    }

    if (originalMessage.channelId) {
      const isAdmin = this.channelSubscriberRepository.validateChannelAdmin(
        originalMessage.channelId,
        session.userId,
      )

      if (!isAdmin) {
        throw new AuthorizationError(ERROR.NOT_ALLOWED)
      }
    }

    if (originalMessage.sender.id !== session.userId) {
      throw new AuthorizationError(ERROR.NOT_ALLOWED)
    }

    await this.messageRepository.deleteMessageByAdmin(messageId)

    await Promise.all(
      originalMessage.attachments.map((attc) =>
        this.storageRepository.deleteFileByUrl(attc.url),
      ),
    )
  }
}
