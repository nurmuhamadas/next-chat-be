import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { ChannelSubscriberRepository } from "@/domains/channels/repositories/channel-subscriber-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class RemoveChannelAdmin {
  constructor(
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
    @inject(KEYS.ChannelSubscriberRepository)
    private channelSubscriberRepository: ChannelSubscriberRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    channelId: string,
    addedUserId: string,
  ) {
    const channel = await this.channelRepository.getPublicOrJoinedChannelById(
      channelId,
      session.userId,
    )

    if (!channel) {
      throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
    }

    if (!channel.isAdmin) {
      throw new AuthorizationError(ERROR.ONLY_ADMIN_CAN_REMOVE_ADMIN)
    }

    const isSubscriber =
      await this.channelSubscriberRepository.validateUserSubscriptionToChannel(
        channelId,
        addedUserId,
      )

    if (!isSubscriber) {
      throw new InvariantError(ERROR.USER_IS_NOT_SUBSCRIBER)
    }

    const isAdmin = await this.channelSubscriberRepository.validateChannelAdmin(
      channelId,
      addedUserId,
    )

    if (!isAdmin) {
      throw new InvariantError(ERROR.USER_IS_NOT_ADMIN)
    }

    await this.channelSubscriberRepository.removeAdmin(channelId, addedUserId)
  }
}
