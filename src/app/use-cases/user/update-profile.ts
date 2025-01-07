import { inject, injectable } from "inversify"

import { AuthTokenManager } from "@/app/security/auth-token-manager"
import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { StorageRepository } from "@/domains/storage/repositories/storage-repository"
import { ProfileEntity } from "@/domains/users/entities/profile-entity"
import { UpdateProfileEntity } from "@/domains/users/entities/update-profile-entity"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class UpdateProfile {
  constructor(
    @inject(KEYS.ProfileRepository)
    private profileRepository: ProfileRepository,
    @inject(KEYS.AuthTokenManager) private tokenManager: AuthTokenManager,
    @inject(KEYS.StorageRepository)
    private storageRepository: StorageRepository,
  ) {}

  async execute({
    entity,
    imageFile,
    session,
  }: {
    entity: UpdateProfileEntity
    imageFile: File
    session: SessionTokenEntity
  }): Promise<ProfileEntity> {
    const profile = await this.profileRepository.findProfileByUserId(
      session.userId,
    )
    if (!profile) {
      throw new InvariantError(ERROR.CREATE_PROFILE_FIRST)
    }

    let fileId: string | undefined
    const oldImageUrl = entity.imageUrl
    if (imageFile) {
      const file = await this.storageRepository.uploadFile(imageFile)
      fileId = file.id
      entity.imageUrl = file.url
    }

    try {
      const profile = await this.profileRepository.updateProfile(
        session.userId,
        entity,
      )

      // DELETE OLD IMAGE IF NEW IMAGE UPLOADED
      if (fileId && oldImageUrl) {
        await this.storageRepository.deleteFileByUrl(oldImageUrl)
      }

      return profile
    } catch {
      if (fileId) {
        await this.storageRepository.deleteFile(fileId)
      }

      throw new Error(ERROR.INTERNAL_SERVER_ERROR)
    }
  }
}
