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
export class GetChannelOption {
  constructor(
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
    @inject(KEYS.ChannelOptionRepository)
    private channelOptionRepository: ChannelOptionRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    channelId: string,
  ): Promise<ChannelOptionEntity> {
    const channel = await this.channelRepository.getPublicOrJoinedChannelById(
      channelId,
      session.userId,
    )

    if (!channel) {
      throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
    }

    if (!channel.isSubscriber) {
      throw new InvariantError(ERROR.USER_IS_NOT_SUBSCRIBER)
    }

    const channelOption = await this.channelOptionRepository.getOption(
      channelId,
      session.userId,
    )

    if (!channelOption) {
      const data = new UpdateChannelOptionEntity(
        channelId,
        session.userId,
        true,
      )
      const option =
        await this.channelOptionRepository.createOrUpdateOption(data)

      return option
    }

    return channelOption
  }
}
