import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { ChannelSubscriberRepository } from "@/domains/channels/repositories/channel-subscriber-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class SubscribeChannel {
  constructor(
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
    @inject(KEYS.ChannelSubscriberRepository)
    private hannelSubscriberRepository: ChannelSubscriberRepository,
  ) {}

  async execute(session: SessionTokenEntity, channelId: string, code?: string) {
    const channel = await this.channelRepository.getGeneralChannelById(
      channelId,
      session.userId,
    )

    if (!channel) {
      throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
    }

    if (channel.isSubscriber) {
      throw new InvariantError(ERROR.ALREADY_SUBSCRIBER)
    }

    if (channel.type === "PRIVATE" && channel.inviteCode !== code) {
      throw new InvariantError(ERROR.INVALID_JOIN_CODE)
    }

    await this.hannelSubscriberRepository.subscribeChannel(
      channelId,
      session.userId,
    )
  }
}
