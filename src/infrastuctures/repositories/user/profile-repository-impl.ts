import { injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { SettingEntity } from "@/domains/settings/entities/setting-entity"
import { CreateProfileEntity } from "@/domains/users/entities/create-profile-entity"
import { DetailProfileEntity } from "@/domains/users/entities/detail-profile-entity"
import { ProfileEntity } from "@/domains/users/entities/profile-entity"
import { SearchUserEntity } from "@/domains/users/entities/search-user-entity"
import { SearchUserForMemberEntity } from "@/domains/users/entities/search-user-for-member-entity"
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
      result.bio,
      result.imageUrl,
      result.lastSeenAt,
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
          bio: profile.bio,
          imageUrl: profile.imageUrl,
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
        profileResult.bio,
        profileResult.imageUrl,
        profileResult.lastSeenAt,
      ),
      new SettingEntity(
        settingResult.id,
        settingResult.userId,
        PrismaHelper.convertDBTimeFormat(settingResult.timeFormat),
        PrismaHelper.convertDBLanguage(settingResult.language),
        settingResult.notifications.map(PrismaHelper.convertDBNotification),
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
      result.bio,
      result.imageUrl,
      result.lastSeenAt,
    )
  }

  async searchUsers(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<SearchUserEntity>> {
    const result = await prisma.profile.findMany({
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

    let nextCursor: string | undefined
    if (result.length > params.limit) {
      nextCursor = result.pop()?.userId
    }

    const data = result.map(
      (v) => new SearchUserEntity(v.userId, v.name, v.imageUrl, v.lastSeenAt),
    )

    return new SearchResultEntity(data, result.length, nextCursor)
  }

  async searchForMember(
    userId: string,
    groupId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<SearchUserForMemberEntity>> {
    const { limit, query, cursor } = params
    const result = await prisma.profile.findMany({
      where: {
        userId: { not: userId },
        OR: [
          { name: { contains: query } },
          { user: { username: { contains: query } } },
        ],
        user: { groups: { none: { groupId, leftAt: null } } },
      },
      select: {
        name: true,
        imageUrl: true,
        lastSeenAt: true,
        userId: true,
        user: {
          select: { setting: { select: { allowAddToGroup: true } } },
        },
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
    })

    let nextCursor: string | undefined
    if (result.length > params.limit) {
      nextCursor = result.pop()?.userId
    }

    const data = result.map(
      (result) =>
        new SearchUserForMemberEntity(
          result.userId,
          result.name,
          result.user.setting?.allowAddToGroup ?? false,
          result.imageUrl,
          result.lastSeenAt,
        ),
    )

    return new SearchResultEntity(data, result.length, nextCursor)
  }

  async getDetailProfile(userId: string): Promise<DetailProfileEntity | null> {
    const result = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: { select: { username: true } },
      },
    })

    if (!result) return null

    return new DetailProfileEntity(
      result.id,
      result.userId,
      result.name,
      result.gender,
      result.user.username,
      result.bio,
      result.imageUrl,
      result.lastSeenAt,
    )
  }

  async findProfileUserIdsByUserIdsExceptUserId(
    userIds: string[],
    userId: string,
  ): Promise<Pick<ProfileEntity, "userId">[]> {
    return prisma.profile.findMany({
      where: {
        userId: { in: userIds, not: userId },
      },
      select: { userId: true },
      take: userIds.length,
    })
  }
}
