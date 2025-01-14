import { CreatePrivateChatEntity } from "../entites/create-private-chat-entity"
import { PrivateChatEntity } from "../entites/private-chat-entity"

export abstract class PrivateChatRepository {
  abstract create(data: CreatePrivateChatEntity): Promise<PrivateChatEntity>

  abstract getByUserIds(
    userId1: string,
    userId2: string,
  ): Promise<PrivateChatEntity | null>

  abstract deleteByUserIds(userId1: string, userId2: string): Promise<void>
}
