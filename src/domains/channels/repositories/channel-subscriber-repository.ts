import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { ChannelSubscriberEntity } from "../entities/channel-subscriber-entity"

export abstract class ChannelSubscriberRepository {
  abstract getSubscribers(
    channelId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<ChannelSubscriberEntity>>
}
