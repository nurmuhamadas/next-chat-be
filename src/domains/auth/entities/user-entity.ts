import { SettingEntity } from "@/domains/settings/entities/setting-entity"
import { ProfileEntity } from "@/domains/users/entities/profile-entity"

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly emailVerifiedAt?: Date | null,
    public readonly setting?: Partial<SettingEntity> | null,
    public readonly profile?: Partial<ProfileEntity> | null,
  ) {}

  get isVerified() {
    return !!this.emailVerifiedAt
  }

  get isProfileCompleted() {
    return !!this.profile
  }
}
