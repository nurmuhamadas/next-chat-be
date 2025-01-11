import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { ChannelSubscriberEntity } from "../entities/channel-subscriber-entity"

export abstract class ChannelSubscriberRepository {
  abstract getSubscribers(
    channelId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<ChannelSubscriberEntity>>

  abstract validateUserSubscriptionToChannel(
    channelId: string,
    userId: string,
  ): Promise<boolean>

  abstract validateChannelAdmin(
    channelId: string,
    userId: string,
  ): Promise<boolean>

  abstract addAdmin(channelId: string, userId: string): Promise<void>

  abstract removeAdmin(channelId: string, userId: string): Promise<void>

  abstract subscribeChannel(channelId: string, userId: string): Promise<void>
}
