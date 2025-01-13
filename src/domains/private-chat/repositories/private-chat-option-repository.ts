import { PrivateChatOptionEntity } from "../entites/private-chat-option-entity"
import { UpdatePrivateChatOptionEntity } from "../entites/update-private-chat-option-entity"

export abstract class PrivateChatOptionRepository {
  abstract getPrivateChatOptionByUserId(
    userId: string,
    userPairId: string,
  ): Promise<PrivateChatOptionEntity | null>

  abstract updatePrivateChatOption(
    id: string,
    option: UpdatePrivateChatOptionEntity,
  ): Promise<PrivateChatOptionEntity>

  abstract clearAllOptionAndCreateNewOne(
    lastOption: PrivateChatOptionEntity,
  ): Promise<PrivateChatOptionEntity>

  abstract getOptionsHistory(
    userId: string,
    userPairId: string,
  ): Promise<PrivateChatOptionEntity[]>
}
