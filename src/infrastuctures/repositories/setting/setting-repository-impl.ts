import { SettingEntity } from "@/domains/settings/entities/setting-entity"
import { UpdateSettingEntity } from "@/domains/settings/entities/update-setting-entity"
import { SettingRepository } from "@/domains/settings/repositories/setting-repository"
import { prisma } from "@/infrastuctures/orm/prisma"
import { PrismaHelper } from "@/infrastuctures/orm/prisma-helper"

export class SettingRepositoryImpl implements SettingRepository {
  async updateSetting(setting: UpdateSettingEntity): Promise<SettingEntity> {
    const result = await prisma.setting.upsert({
      where: { userId: setting.userId },
      create: {
        userId: setting.userId,
        language: setting.language,
        timeFormat: setting.timeFormat
          ? PrismaHelper.convertTimeFormat(setting.timeFormat)
          : undefined,
        notifications: setting.notifications,
        allowAddToGroup: setting.allowAddToGroup,
        enable2FA: setting.enable2FA,
        showLastSeen: setting.showLastSeen,
      },
      update: {
        language: setting.language,
        timeFormat: setting.timeFormat
          ? PrismaHelper.convertTimeFormat(setting.timeFormat)
          : undefined,
        notifications: setting.notifications,
        allowAddToGroup: setting.allowAddToGroup,
        enable2FA: setting.enable2FA,
        showLastSeen: setting.showLastSeen,
      },
    })

    return new SettingEntity(
      result.id,
      result.userId,
      PrismaHelper.convertDBTimeFormat(result.timeFormat),
      PrismaHelper.convertDBLanguage(result.language),
      result.notifications.map(PrismaHelper.convertDBNotification),
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
      result.id,
      result.userId,
      PrismaHelper.convertDBTimeFormat(result.timeFormat),
      PrismaHelper.convertDBLanguage(result.language),
      result.notifications.map(PrismaHelper.convertDBNotification),
      result.enable2FA,
      result.showLastSeen,
      result.allowAddToGroup,
    )
  }
}
