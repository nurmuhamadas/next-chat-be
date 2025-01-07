import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { BlockedUserRepository } from "@/domains/blocked-users/repositories/blocked-user-repository"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class BlockUser {
  constructor(
    @inject(KEYS.BlockedUserRepository)
    private blockedUserRepository: BlockedUserRepository,
    @inject(KEYS.ProfileRepository)
    private profileRepository: ProfileRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    blockedUserId: string,
  ): Promise<void> {
    if (session.userId === blockedUserId) {
      throw new AuthorizationError(ERROR.CANNOT_BLOCK_IT_SELF)
    }

    const blockedUserProfile =
      await this.profileRepository.findProfileByUserId(blockedUserId)

    if (!blockedUserProfile) {
      throw new NotFoundError(ERROR.USER_NOT_FOUND)
    }

    const isAlreadyBlocked = await this.blockedUserRepository.getIsUserBlocked(
      session.userId,
      blockedUserId,
    )
    if (isAlreadyBlocked) {
      throw new InvariantError(ERROR.USER_ALREADY_BLOCKED)
    }

    await this.blockedUserRepository.blockUser(session.userId, blockedUserId)
  }
}
