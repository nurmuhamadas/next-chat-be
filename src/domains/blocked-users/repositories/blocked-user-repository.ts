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

  abstract blockUser(userId: string, blockedUserId: string): Promise<void>

  abstract unblockUser(userId: string, blockedUserId: string): Promise<void>

  abstract getBlockedUserIdsByUserIds(
    userId: string,
    userIds: string[],
  ): Promise<Pick<BlockedUserEntity, "blockedUserId">[]>

  abstract getBlockedByUserIdsByUserIds(
    userId: string,
    userIds: string[],
  ): Promise<Pick<BlockedUserEntity, "userId">[]>

  abstract getBlockedHistory(
    userId: string,
    blockedUserId: string,
  ): Promise<BlockedUserEntity[]>
}
