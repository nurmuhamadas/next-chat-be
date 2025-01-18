import { SettingEntity } from "../entities/setting-entity"
import { UpdateSettingEntity } from "../entities/update-setting-entity"

export abstract class SettingRepository {
  abstract updateSetting(setting: UpdateSettingEntity): Promise<SettingEntity>

  abstract getSettingByUserId(userId: string): Promise<SettingEntity | null>
}
