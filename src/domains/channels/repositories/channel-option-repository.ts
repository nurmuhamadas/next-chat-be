import { ChannelOptionEntity } from "../entities/channel-option-entity"
import { UpdateChannelOptionEntity } from "../entities/update-channel-option-entity"

export abstract class ChannelOptionRepository {
  abstract clearAllChats(
    channelId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<void>

  abstract getOption(
    channelId: string,
    userId: string,
  ): Promise<ChannelOptionEntity | null>

  abstract createOrUpdateOption(
    data: UpdateChannelOptionEntity,
    id?: string,
  ): Promise<ChannelOptionEntity>
}
