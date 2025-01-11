import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { ChannelEntity } from "../entities/channel-entity"

export abstract class ChannelRepository {
  abstract getSubscribedChannels(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<ChannelEntity>>
}
