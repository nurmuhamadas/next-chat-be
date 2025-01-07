import { CreateSettingEntity } from "../entities/create-setting-entity"
import { SettingEntity } from "../entities/setting-entity"

export abstract class SettingRepository {
  abstract createSetting(setting: CreateSettingEntity): Promise<SettingEntity>

  abstract getSettingByUserId(userId: string): Promise<SettingEntity | null>
}
