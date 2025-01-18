import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { ChannelSubscriberRepository } from "@/domains/channels/repositories/channel-subscriber-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class UnsubscribeChannel {
  constructor(
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
    @inject(KEYS.ChannelSubscriberRepository)
    private channelSubscriberRepository: ChannelSubscriberRepository,
  ) {}

  async execute(session: SessionTokenEntity, channelId: string) {
    const channel = await this.channelRepository.getGeneralChannelById(
      channelId,
      session.userId,
    )

    if (!channel) {
      throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
    }

    if (!channel.isSubscriber) {
      throw new InvariantError(ERROR.USER_IS_NOT_SUBSCRIBER)
    }

    if (channel.totalSubscribers === 1) {
      await this.channelRepository.softDeleteChannel(channelId)
      return
    }

    const totalAdmins =
      await this.channelSubscriberRepository.getTotalAdmins(channelId)

    const isOnlyOneAdmin = channel.isAdmin && totalAdmins === 1
    if (isOnlyOneAdmin) {
      const subscribers = await this.channelSubscriberRepository.getSubscribers(
        channelId,
        {
          limit: 2,
        },
      )
      const otherSubscriber = subscribers.data.find(
        (member) => member.id !== session.userId,
      )

      if (otherSubscriber) {
        await this.channelSubscriberRepository.addAdmin(
          channelId,
          otherSubscriber.id,
        )
      }
    }

    await this.channelSubscriberRepository.unsubscribeChannel(
      channelId,
      session.userId,
    )
  }
}
