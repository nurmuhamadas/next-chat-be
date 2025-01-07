import { SettingEntity } from "@/domains/settings/entities/setting-entity"
import { SettingRepository } from "@/domains/settings/repositories/setting-repository"
import { prisma } from "@/infrastuctures/orm/prisma"
import { PrismaHelper } from "@/infrastuctures/orm/prisma-helper"

export class SettingRepositoryImpl implements SettingRepository {
  async createSetting(setting: SettingEntity): Promise<SettingEntity> {
    const result = await prisma.setting.create({
      data: {
        userId: setting.userId,
        language: setting.language,
        timeFormat: PrismaHelper.convertTimeFormat(setting.timeFormat),
        notifications: setting.notifications,
        allowAddToGroup: setting.allowAddToGroup,
        enable2FA: setting.enable2FA,
        showLastSeen: setting.showLastSeen,
      },
    })

    return new SettingEntity(
      result.userId,
      PrismaHelper.convertDBTimeFormat(result.timeFormat),
      result.language,
      result.notifications,
      result.enable2FA,
      result.showLastSeen,
      result.allowAddToGroup,
    )
  }

  async getSettingByUserId(userId: string): Promise<SettingEntity | null> {
    const result = await prisma.setting.findUnique({
      where: { userId },
    })

    if (!result) return null

    return new SettingEntity(
      result.userId,
      PrismaHelper.convertDBTimeFormat(result.timeFormat),
      result.language,
      result.notifications,
      result.enable2FA,
      result.showLastSeen,
      result.allowAddToGroup,
    )
  }
}
