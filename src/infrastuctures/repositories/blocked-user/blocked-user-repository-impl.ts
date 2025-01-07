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
}
