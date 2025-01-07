import { SettingEntity } from "@/domains/settings/entities/setting-entity"

import { CreateProfileEntity } from "../entities/create-profile-entity"
import { ProfileEntity } from "../entities/profile-entity"

export abstract class ProfileRepository {
  abstract findProfileByUserId(userId: string): Promise<ProfileEntity | null>

  abstract createProfileWithSetting(
    profile: CreateProfileEntity,
  ): Promise<[ProfileEntity, SettingEntity]>
}
