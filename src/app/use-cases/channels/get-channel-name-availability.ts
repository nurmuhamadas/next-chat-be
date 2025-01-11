import { inject, injectable } from "inversify"

import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetChannelNameAvailability {
  constructor(
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
  ) {}

  async execute(session: SessionTokenEntity, name: string): Promise<boolean> {
    return this.channelRepository.checkChannelNameAvailability(
      session.userId,
      name,
    )
  }
}
