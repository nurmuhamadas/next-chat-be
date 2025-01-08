import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { SettingEntity } from "@/domains/settings/entities/setting-entity"

import { CreateProfileEntity } from "../entities/create-profile-entity"
import { DetailProfileEntity } from "../entities/detail-profile-entity"
import { ProfileEntity } from "../entities/profile-entity"
import { SearchUserEntity } from "../entities/search-user-entity"
import { SearchUserForMemberEntity } from "../entities/search-user-for-member-entity"
import { UpdateProfileEntity } from "../entities/update-profile-entity"

export abstract class ProfileRepository {
  abstract findProfileByUserId(userId: string): Promise<ProfileEntity | null>

  abstract createProfileWithSetting(
    profile: CreateProfileEntity,
  ): Promise<[ProfileEntity, SettingEntity]>

  abstract updateProfile(
    userId: string,
    profile: UpdateProfileEntity,
  ): Promise<ProfileEntity>

  abstract searchUsers(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<SearchUserEntity>>

  abstract searchForMember(
    userId: string,
    groupId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<SearchUserForMemberEntity>>

  abstract getDetailProfile(userId: string): Promise<DetailProfileEntity | null>

  abstract findProfileUserIdsByUserIdsExceptUserId(
    userIds: string[],
    userId: string,
  ): Promise<Pick<ProfileEntity, "userId">[]>
}
