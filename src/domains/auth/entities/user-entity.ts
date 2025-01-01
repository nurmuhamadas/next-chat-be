import { SettingEntity } from "@/domains/settings/entities/setting-entity"
import { ProfileEntity } from "@/domains/users/entities/profile-entity"

export class UserEntity {
  constructor(
    public readonly id: string,
    public username: string,
    public email: string,
    public password: string,
    public emailVerifiedAt: Date | null,
    public setting?: Partial<SettingEntity>,
    public profile?: Partial<ProfileEntity>,
  ) {}

  get isVerified() {
    return !!this.emailVerifiedAt
  }

  get isProfileCompleted() {
    return !!this.profile
  }
}
