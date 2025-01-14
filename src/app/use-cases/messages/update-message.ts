import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { MessageEntity } from "@/domains/messages/entities/message-entity"
import { UpdateMessageEntity } from "@/domains/messages/entities/update-message-entity"
import { MessageRepository } from "@/domains/messages/repositories/message-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class UpdateMessage {
  constructor(
    @inject(KEYS.MessageRepository)
    private messageRepository: MessageRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    messageId: string,
    data: UpdateMessageEntity,
  ): Promise<MessageEntity> {
    const originalMessage =
      await this.messageRepository.getMessageById(messageId)

    if (!originalMessage) {
      throw new NotFoundError(ERROR.MESSAGE_NOT_FOUND)
    }

    if (originalMessage.sender.id !== session.userId) {
      throw new AuthorizationError(ERROR.NOT_ALLOWED)
    }

    if (originalMessage.status !== "DEFAULT") {
      throw new AuthorizationError(ERROR.UPDATE_DELETED_MESSAGE_NOT_ALLOWED)
    }

    const result = await this.messageRepository.updateMessage(messageId, data)

    return result
  }
}
