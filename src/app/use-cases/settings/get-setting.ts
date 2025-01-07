import { inject, injectable } from "inversify"

import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { SettingEntity } from "@/domains/settings/entities/setting-entity"
import { UpdateSettingEntity } from "@/domains/settings/entities/update-setting-entity"
import { SettingRepository } from "@/domains/settings/repositories/setting-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetSetting {
  constructor(
    @inject(KEYS.SettingRepository)
    private settingRepository: SettingRepository,
  ) {}

  async execute(session: SessionTokenEntity): Promise<SettingEntity> {
    const result = await this.settingRepository.getSettingByUserId(
      session.userId,
    )

    if (!result) {
      const setting = new UpdateSettingEntity(session.userId)
      return await this.settingRepository.updateSetting(setting)
    }

    return result
  }
}
