import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { ChannelOptionEntity } from "@/domains/channels/entities/channel-option-entity"
import { UpdateChannelOptionEntity } from "@/domains/channels/entities/update-channel-option-entity"
import { ChannelOptionRepository } from "@/domains/channels/repositories/channel-option-repository"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class UpdateChannelOption {
  constructor(
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
    @inject(KEYS.ChannelOptionRepository)
    private channelOptionRepository: ChannelOptionRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    data: UpdateChannelOptionEntity,
  ): Promise<ChannelOptionEntity> {
    const channel = await this.channelRepository.getPublicOrJoinedChannelById(
      data.channelId,
      session.userId,
    )

    if (!channel) {
      throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
    }

    if (!channel.isSubscriber) {
      throw new InvariantError(ERROR.USER_IS_NOT_SUBSCRIBER)
    }

    const channelOption = await this.channelOptionRepository.getOption(
      data.channelId,
      session.userId,
    )

    const option = await this.channelOptionRepository.createOrUpdateOption(
      data,
      channelOption?.id,
    )

    return option
  }
}
