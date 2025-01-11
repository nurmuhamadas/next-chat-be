import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class DeleteChannel {
  constructor(
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
  ) {}

  async execute(session: SessionTokenEntity, channelId: string): Promise<void> {
    const currentChannel =
      await this.channelRepository.getPublicOrJoinedChannelById(
        channelId,
        session.userId,
      )

    if (!currentChannel) {
      throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
    }

    if (!currentChannel.isAdmin) {
      throw new AuthorizationError(ERROR.UNAUTHORIZE)
    }

    await this.channelRepository.softDeleteChannel(channelId)
  }
}
