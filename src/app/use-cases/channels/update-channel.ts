import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { ChannelEntity } from "@/domains/channels/entities/channel-entity"
import { UpdateChannelEntity } from "@/domains/channels/entities/update-channel-entity"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { StorageRepository } from "@/domains/storage/repositories/storage-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class UpdateChannel {
  constructor(
    @inject(KEYS.ChannelRepository)
    private channelRepository: ChannelRepository,
    @inject(KEYS.StorageRepository)
    private storageRepository: StorageRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    data: UpdateChannelEntity,
    imageFile?: File,
  ): Promise<ChannelEntity> {
    const currentChannel =
      await this.channelRepository.getPublicOrJoinedChannelById(
        data.id,
        session.userId,
      )

    if (!currentChannel) {
      throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
    }

    if (!currentChannel.isAdmin) {
      throw new AuthorizationError(ERROR.UNAUTHORIZE)
    }

    if (data.name && data.name !== currentChannel.name) {
      const isNameAvailable =
        await this.channelRepository.checkChannelNameAvailability(
          session.userId,
          data.name,
        )

      if (!isNameAvailable) {
        throw new InvariantError(ERROR.CHANNEL_NAME_DUPLICATED)
      }
    }

    let fileId: string | undefined
    if (imageFile) {
      const file = await this.storageRepository.uploadFile(imageFile)
      fileId = file.id
      data.imageUrl = file.url
    }

    try {
      const result = await this.channelRepository.updateChannel(
        session.userId,
        data,
      )

      // DELETE OLD IMAGE IF NEW IMAGE UPLOADED
      if (fileId && currentChannel.imageUrl) {
        await this.storageRepository.deleteFileByUrl(currentChannel.imageUrl)
      }

      return result
    } catch (e) {
      if (fileId) {
        await this.storageRepository.deleteFile(fileId)
      }
      throw e
    }
  }
}
