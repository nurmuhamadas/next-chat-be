import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { ChannelSubscriberEntity } from "@/domains/channels/entities/channel-subscriber-entity"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { ChannelSubscriberRepository } from "@/domains/channels/repositories/channel-subscriber-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetChannelSubscribers {
  constructor(
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
    @inject(KEYS.ChannelSubscriberRepository)
    private channelSubscriberRepository: ChannelSubscriberRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    channelId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<ChannelSubscriberEntity>> {
    const channel = await this.channelRepository.getPublicOrJoinedChannelById(
      channelId,
      session.userId,
    )

    if (!channel) {
      throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
    }

    return this.channelSubscriberRepository.getSubscribers(channelId, params)
  }
}
