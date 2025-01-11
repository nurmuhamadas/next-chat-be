import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { ChannelEntity } from "@/domains/channels/entities/channel-entity"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetChannelById {
  constructor(
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    id: string,
  ): Promise<ChannelEntity> {
    const channel =
      await this.channelRepository.getPublicOrJoinedChannelByIdIncludeDeleted(
        id,
        session.userId,
      )

    if (!channel) {
      throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
    }

    if (channel.isDeleted) {
      return channel.deletedChannel
    }

    return channel
  }
}
