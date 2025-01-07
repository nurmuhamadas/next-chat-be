import { inject, injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { BlockedUserEntity } from "@/domains/blocked-users/entities/blocked-user-entity"
import { BlockedUserRepository } from "@/domains/blocked-users/repositories/blocked-user-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetBlockedUsers {
  constructor(
    @inject(KEYS.BlockedUserRepository)
    private blockedUserRepository: BlockedUserRepository,
  ) {}

  async execute(
    session: SessionTokenEntity,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<BlockedUserEntity>> {
    return this.blockedUserRepository.getBlockedUsers(session.userId, params)
  }
}
