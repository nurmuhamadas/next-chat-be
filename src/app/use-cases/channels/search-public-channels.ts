import { inject, injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class SearchPublicChannels {
  constructor(
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
  ) {}

  async execute(session: SessionTokenEntity, params: SearchParamsEntity) {
    return this.channelRepository.searchPublicChannels(session.userId, params)
  }
}
