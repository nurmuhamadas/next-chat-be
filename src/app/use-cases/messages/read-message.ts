import { inject, injectable } from "inversify"

import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { MessageRepository } from "@/domains/messages/repositories/message-repository"
import { UnreadMessageRepository } from "@/domains/messages/repositories/unread-message-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class ReadMessage {
  constructor(
    @inject(KEYS.UnreadMessageRepository)
    private unreadMessageRepository: UnreadMessageRepository,
    @inject(KEYS.MessageRepository)
    private messageRepository: MessageRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    receiverId: string,
  ): Promise<void> {
    await this.unreadMessageRepository.readMessage(session.userId, receiverId)
  }
}
