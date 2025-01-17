import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import InvariantError from "@/common/exceptions/invariant-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { CreateMessageEntity } from "@/domains/messages/entities/create-message-entity"
import { MessageEntity } from "@/domains/messages/entities/message-entity"
import { MessageRepository } from "@/domains/messages/repositories/message-repository"
import { RoomType } from "@/domains/rooms/entities/enums"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class ForwardMessage {
  constructor(
    @inject(KEYS.MessageRepository)
    private messageRepository: MessageRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    receiverId: string,
    messageId: string,
    roomType: RoomType,
  ): Promise<MessageEntity> {
    const originalMessage =
      await this.messageRepository.getMessageById(messageId)

    if (!originalMessage) {
      throw new InvariantError(ERROR.MESSAGE_NOT_FOUND, ["originalMessageId"])
    }

    if (originalMessage.status !== "DEFAULT") {
      throw new AuthorizationError(ERROR.UPDATE_DELETED_MESSAGE_NOT_ALLOWED)
    }

    const result = await this.messageRepository.createMessage(
      session.userId,
      new CreateMessageEntity(
        receiverId,
        roomType,
        originalMessage.isEmojiOnly,
        originalMessage.message,
        null,
        originalMessage.sender.id === session.userId ? null : messageId,
        originalMessage.attachments,
      ),
    )

    return result
  }
}
