import { injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { GroupEntity } from "@/domains/groups/entities/group-entity"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { prisma } from "@/infrastuctures/orm/prisma"
import { PrismaHelper } from "@/infrastuctures/orm/prisma-helper"

@injectable()
export class GroupRepositoryImpl implements GroupRepository {
  private getGroupIncludeQuery = ({ userId }: { userId: string }) => {
    return {
      members: {
        where: { userId, leftAt: null },
        select: { isAdmin: true },
      },
      _count: {
        select: { members: { where: { leftAt: null } } },
      },
    }
  }

  async getGroups(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<GroupEntity>> {
    const { limit, cursor, query } = params

    const result = await prisma.group.findMany({
      where: {
        members: { some: { userId, leftAt: null } },
        name: { contains: query, mode: "insensitive" },
        deletedAt: null,
      },
      include: { ...this.getGroupIncludeQuery({ userId }) },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
    })

    const data = result.map((v) => {
      return new GroupEntity(
        v.id,
        v.name,
        PrismaHelper.convertDBGroupType(v.type),
        v.ownerId,
        v.inviteCode,
        v._count.members,
        v.members.length > 0,
        v.members[0]?.isAdmin ?? false,
        v.description ?? undefined,
        v.imageUrl ?? undefined,
      )
    })

    let nextCursor: string | undefined
    if (result.length > limit) {
      nextCursor = result[result.length - 1].id
      result.pop()
    }

    return new SearchResultEntity(data, data.length, nextCursor)
  }
}
