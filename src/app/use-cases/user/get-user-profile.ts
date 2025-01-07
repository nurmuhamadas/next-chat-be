import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import NotFoundError from "@/common/exceptions/not-found-error"
import { DetailProfileEntity } from "@/domains/users/entities/detail-profile-entity"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetUserProfile {
  constructor(
    @inject(KEYS.ProfileRepository)
    private profileRepository: ProfileRepository,
  ) {}

  async execute(userId: string): Promise<DetailProfileEntity> {
    const result = await this.profileRepository.getDetailProfile(userId)

    if (!result) throw new NotFoundError(ERROR.PROFILE_NOT_FOUND)

    return result
  }
}
