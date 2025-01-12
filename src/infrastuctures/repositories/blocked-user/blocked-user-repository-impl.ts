import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { BlockedUserEntity } from "@/domains/blocked-users/entities/blocked-user-entity"
import { BlockedUserRepository } from "@/domains/blocked-users/repositories/blocked-user-repository"
import { prisma } from "@/infrastuctures/orm/prisma"

export class BlockedUserRepositoryImpl implements BlockedUserRepository {
  async getBlockedUsers(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<BlockedUserEntity>> {
    const { cursor, limit } = params
    const result = await prisma.blockedUser.findMany({
      where: { userId, unblockedAt: null },
      select: {
        id: true,
        blockedUserId: true,
        createdAt: true,
        blockedUser: {
          select: {
            id: true,
            profile: { select: { name: true, imageUrl: true } },
          },
        },
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
    })

    const data = result.map((result) => {
      return new BlockedUserEntity(
        result.id,
        userId,
        result.blockedUserId,
        result.blockedUser.profile?.name ?? "Unknown",
        result.createdAt,
        result.blockedUser.profile?.imageUrl ?? undefined,
      )
    })

    let nextCursor: string | undefined
    if (data.length > limit) {
      nextCursor = data[data.length - 1].id
      data.pop()
    }

    return new SearchResultEntity(data, data.length, nextCursor)
  }

  async getIsUserBlocked(
    userId: string,
    blockedUserId: string,
  ): Promise<boolean> {
    const result = await prisma.blockedUser.count({
      where: { blockedUserId, userId, unblockedAt: null },
    })

    return result > 0
  }

  async blockUser(userId: string, blockedUserId: string): Promise<void> {
    await prisma.blockedUser.create({ data: { userId, blockedUserId } })
  }

  async unblockUser(userId: string, blockedUserId: string): Promise<void> {
    await prisma.blockedUser.updateMany({
      where: { userId, blockedUserId, unblockedAt: null },
      data: { unblockedAt: new Date() },
    })
  }

  async getBlockedUserIdsByUserIds(
    userId: string,
    userIds: string[],
  ): Promise<Pick<BlockedUserEntity, "blockedUserId">[]> {
    return prisma.blockedUser.findMany({
      where: {
        userId,
        blockedUserId: { in: userIds },
        unblockedAt: { equals: null },
      },
      select: { blockedUserId: true },
    })
  }

  async getBlockedByUserIdsByUserIds(
    userId: string,
    userIds: string[],
  ): Promise<Pick<BlockedUserEntity, "userId">[]> {
    return prisma.blockedUser.findMany({
      where: {
        userId: { in: userIds },
        blockedUserId: userId,
        unblockedAt: { equals: null },
      },
      select: { userId: true },
    })
  }
}
