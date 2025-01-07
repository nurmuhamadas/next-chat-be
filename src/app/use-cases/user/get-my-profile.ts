import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthenticationError from "@/common/exceptions/authentication-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { DetailProfileEntity } from "@/domains/users/entities/detail-profile-entity"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetMyProfile {
  constructor(
    @inject(KEYS.ProfileRepository)
    private profileRepository: ProfileRepository,
  ) {}

  async execute(session: SessionTokenEntity): Promise<DetailProfileEntity> {
    const result = await this.profileRepository.getDetailProfile(session.userId)

    if (!result) throw new AuthenticationError(ERROR.UNAUTHENTICATED)

    return result
  }
}
