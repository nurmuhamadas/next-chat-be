import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { BlockedUserRepository } from "@/domains/blocked-users/repositories/blocked-user-repository"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetIsUserBlocked {
  constructor(
    @inject(KEYS.BlockedUserRepository)
    private blockedUserRepository: BlockedUserRepository,
    @inject(KEYS.ProfileRepository)
    private profileRepository: ProfileRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    blockedUserId: string,
  ): Promise<boolean> {
    const user = await this.profileRepository.findProfileByUserId(blockedUserId)

    if (!user) {
      throw new InvariantError(ERROR.USER_NOT_FOUND)
    }

    const blockedUser = await this.blockedUserRepository.getIsUserBlocked(
      session.userId,
      blockedUserId,
    )

    return !!blockedUser
  }
}
