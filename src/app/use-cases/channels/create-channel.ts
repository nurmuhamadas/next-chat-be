import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { CreateChannelEntity } from "@/domains/channels/entities/create-channel-entity"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { StorageRepository } from "@/domains/storage/repositories/storage-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class CreateChannel {
  constructor(
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
    @inject(KEYS.StorageRepository)
    private storageRepository: StorageRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    data: CreateChannelEntity,
    imageFile: File,
  ) {
    const isNameAvailable =
      await this.channelRepository.checkChannelNameAvailability(
        session.userId,
        data.name,
      )
    if (!isNameAvailable) {
      throw new InvariantError(ERROR.GROUP_NAME_DUPLICATED)
    }

    let fileId: string | undefined
    if (imageFile) {
      const file = await this.storageRepository.uploadFile(imageFile)
      fileId = file.id
      data.imageUrl = file.url
    }

    try {
      const result = await this.channelRepository.createChannel(data)

      return result
    } catch (e) {
      if (fileId) {
        await this.storageRepository.deleteFile(fileId)
      }
      throw e
    }
  }
}
