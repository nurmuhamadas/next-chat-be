import { Context } from "hono"
import { inject, injectable } from "inversify"

import { AuthTokenManager } from "@/app/security/auth-token-manager"
import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import { CookieHelper } from "@/common/lib/cookie-helper"
import { SessionEntity } from "@/domains/auth/entities/session-entity"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { SessionRepository } from "@/domains/auth/repositories/session-repository"
import { StorageRepository } from "@/domains/storage/repositories/storage-repository"
import { CreateProfileEntity } from "@/domains/users/entities/create-profile-entity"
import { ProfileEntity } from "@/domains/users/entities/profile-entity"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class CreateProfile {
  constructor(
    @inject(KEYS.ProfileRepository)
    private profileRepository: ProfileRepository,
    @inject(KEYS.SessionRepository)
    private sessionRepository: SessionRepository,
    @inject(KEYS.AuthTokenManager) private tokenManager: AuthTokenManager,
    @inject(KEYS.StorageRepository)
    private storageRepository: StorageRepository,
  ) {}

  async execute(
    c: Context,
    {
      entity,
      imageFile,
      session,
      userAgent,
    }: {
      entity: CreateProfileEntity
      imageFile: File
      session: SessionTokenEntity
      userAgent: string
    },
  ): Promise<ProfileEntity> {
    const profile = await this.profileRepository.findProfileByUserId(
      entity.userId,
    )
    if (profile) {
      throw new InvariantError(ERROR.PROFILE_ALREADY_CREATED)
    }

    let fileId: string | undefined
    if (imageFile) {
      const file = await this.storageRepository.uploadFile(imageFile)
      fileId = file.id
      entity.imageUrl = file.url
    }

    try {
      const [profile] =
        await this.profileRepository.createProfileWithSetting(entity)

      const deviceId =
        CookieHelper.getDeviceId(c) ?? CookieHelper.generateDeviceId()
      const sessionTokenEntity = new SessionTokenEntity(
        session.userId,
        session.username,
        deviceId,
        session.email,
        userAgent,
        true,
      )
      const sessionToken =
        await this.tokenManager.generateSessionToken(sessionTokenEntity)
      const sessionEntity = new SessionEntity(
        session.userId,
        sessionToken,
        deviceId,
        userAgent,
        session.email,
        this.tokenManager.getTokenExpired(),
      )
      const newSession = await this.sessionRepository.createOrUpdateSession(
        sessionEntity,
        `Update profile ${userAgent}`,
      )

      CookieHelper.setAuthCookies(c, newSession)

      return profile
    } catch {
      if (fileId) {
        await this.storageRepository.deleteFile(fileId)
      }

      throw new Error(ERROR.INTERNAL_SERVER_ERROR)
    }
  }
}
