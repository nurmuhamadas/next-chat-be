import { PrivateChatOptionEntity } from "../entites/private-chat-option-entity"

export abstract class PrivateChatOptionRepository {
  abstract getPrivateChatOptionByUserId(
    userId: string,
    userPairId: string,
  ): Promise<PrivateChatOptionEntity | null>
}
