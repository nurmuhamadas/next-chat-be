import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { MessageRepository } from "@/domains/messages/repositories/message-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class DeleteMessageForMe {
  constructor(
    @inject(KEYS.MessageRepository)
    private messageRepository: MessageRepository,
  ) {}

  async execute(session: SessionTokenEntity, messageId: string): Promise<void> {
    const originalMessage =
      await this.messageRepository.getMessageById(messageId)

    if (!originalMessage) {
      throw new NotFoundError(ERROR.MESSAGE_NOT_FOUND)
    }

    if (originalMessage.sender.id !== session.userId) {
      throw new AuthorizationError(ERROR.NOT_ALLOWED)
    }

    if (originalMessage.status !== "DEFAULT") {
      throw new InvariantError(ERROR.MESSAGE_ALREADY_DELETED)
    }

    await this.messageRepository.deleteMessage(messageId)
  }
}
