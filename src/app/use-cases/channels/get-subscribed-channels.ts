import { inject, injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { ChannelEntity } from "@/domains/channels/entities/channel-entity"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetSubscribedChannels {
  constructor(
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<ChannelEntity>> {
    return this.channelRepository.getSubscribedChannels(session.userId, params)
  }
}
