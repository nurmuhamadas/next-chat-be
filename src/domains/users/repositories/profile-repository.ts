import { SettingEntity } from "@/domains/settings/entities/setting-entity"

import { CreateProfileEntity } from "../entities/create-profile-entity"
import { ProfileEntity } from "../entities/profile-entity"
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
}
