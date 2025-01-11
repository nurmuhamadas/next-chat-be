import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { ChannelEntity } from "../entities/channel-entity"
import { ChannelSearchEntity } from "../entities/channel-search-entity"
import { CreateChannelEntity } from "../entities/create-channel-entity"

export abstract class ChannelRepository {
  abstract getSubscribedChannels(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<ChannelEntity>>

  abstract checkChannelNameAvailability(
    ownerId: string,
    name: string,
  ): Promise<boolean>

  abstract createChannel(channel: CreateChannelEntity): Promise<ChannelEntity>

  abstract searchPublicChannels(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<ChannelSearchEntity>>
}
