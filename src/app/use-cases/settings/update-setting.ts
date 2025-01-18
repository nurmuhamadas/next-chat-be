import { inject, injectable } from "inversify"

import { SettingEntity } from "@/domains/settings/entities/setting-entity"
import { UpdateSettingEntity } from "@/domains/settings/entities/update-setting-entity"
import { SettingRepository } from "@/domains/settings/repositories/setting-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class UpdateSetting {
  constructor(
    @inject(KEYS.SettingRepository)
    private settingRepository: SettingRepository,
  ) {}

  async execute(setting: UpdateSettingEntity): Promise<SettingEntity> {
    return this.settingRepository.updateSetting(setting)
  }
}
