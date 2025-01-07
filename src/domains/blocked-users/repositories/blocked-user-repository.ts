import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { BlockedUserEntity } from "../entities/blocked-user-entity"

export abstract class BlockedUserRepository {
  abstract getBlockedUsers(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<BlockedUserEntity>>

  abstract getIsUserBlocked(
    userId: string,
    blockedUserId: string,
  ): Promise<boolean>
}
