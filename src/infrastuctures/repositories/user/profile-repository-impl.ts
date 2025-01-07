import { injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { SettingEntity } from "@/domains/settings/entities/setting-entity"
import { CreateProfileEntity } from "@/domains/users/entities/create-profile-entity"
import { ProfileEntity } from "@/domains/users/entities/profile-entity"
import { SearchUserEntity } from "@/domains/users/entities/search-user-entity"
import { UpdateProfileEntity } from "@/domains/users/entities/update-profile-entity"
import { ProfileRepository } from "@/domains/users/repositories/profile-repository"
import { prisma } from "@/infrastuctures/orm/prisma"
import { PrismaHelper } from "@/infrastuctures/orm/prisma-helper"

@injectable()
export class ProfileRepositoryImpl implements ProfileRepository {
  async findProfileByUserId(userId: string): Promise<ProfileEntity | null> {
    const result = await prisma.profile.findUnique({ where: { userId } })

    if (!result) return null

    return new ProfileEntity(
      result.id,
      result.userId,
      result.name,
      result.gender,
      result.bio ?? undefined,
      result.imageUrl ?? undefined,
      result.lastSeenAt ?? undefined,
    )
  }

  async createProfileWithSetting(
    profile: CreateProfileEntity,
  ): Promise<[ProfileEntity, SettingEntity]> {
    const [profileResult, settingResult] = await prisma.$transaction([
      prisma.profile.create({
        data: {
          userId: profile.userId,
          name: profile.name,
          gender: profile.gender,
          bio: profile.bio ?? undefined,
          imageUrl: profile.imageUrl ?? undefined,
        },
      }),
      prisma.setting.create({
        data: {
          userId: profile.userId,
          language: "en_US",
          timeFormat: "HALF_DAY",
          notifications: ["CHANNEL", "GROUP", "PRIVATE"],
          allowAddToGroup: false,
          enable2FA: false,
          showLastSeen: true,
        },
      }),
    ])

    return [
      new ProfileEntity(
        profileResult.id,
        profileResult.userId,
        profileResult.name,
        profileResult.gender,
        profileResult.bio ?? undefined,
        profileResult.imageUrl ?? undefined,
        profileResult.lastSeenAt ?? undefined,
      ),
      new SettingEntity(
        settingResult.userId,
        PrismaHelper.convertDBTimeFormat(settingResult.timeFormat),
        settingResult.language,
        settingResult.notifications,
        settingResult.enable2FA,
        settingResult.showLastSeen,
        settingResult.allowAddToGroup,
      ),
    ]
  }

  async updateProfile(
    userId: string,
    profile: UpdateProfileEntity,
  ): Promise<ProfileEntity> {
    const result = await prisma.profile.update({
      where: { userId },
      data: {
        name: profile.name,
        gender: profile.gender,
        bio: profile.bio,
        imageUrl: profile.imageUrl,
      },
    })

    return new ProfileEntity(
      result.id,
      result.userId,
      result.name,
      result.gender,
      result.bio ?? undefined,
      result.imageUrl ?? undefined,
      result.lastSeenAt ?? undefined,
    )
  }

  async searchUsers(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<SearchUserEntity>> {
    const results = await prisma.profile.findMany({
      where: {
        userId: { not: userId },
        OR: [
          { name: { contains: params.query } },
          { user: { username: { contains: params.query } } },
        ],
      },
      select: {
        name: true,
        imageUrl: true,
        lastSeenAt: true,
        userId: true,
      },
      take: params.limit + 1,
      cursor: params.cursor ? { id: params.cursor } : undefined,
      skip: params.cursor ? 1 : undefined,
    })

    const data = results.map(
      (result) =>
        new SearchUserEntity(
          result.userId,
          result.name,
          result.imageUrl ?? undefined,
          result.lastSeenAt ?? undefined,
        ),
    )

    let nextCursor: string | undefined
    if (data.length > params.limit) {
      nextCursor = data[data.length - 1].id
      data.pop()
    }

    return new SearchResultEntity(data, results.length, nextCursor)
  }
}
