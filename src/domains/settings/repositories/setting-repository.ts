import { SettingEntity } from "../entities/setting-entity"

export abstract class SettingRepository {
  abstract createSetting(setting: SettingEntity): Promise<SettingEntity>

  abstract getSettingByUserId(userId: string): Promise<SettingEntity | null>
}
