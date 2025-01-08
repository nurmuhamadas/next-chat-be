import { injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { GroupMemberEntity } from "@/domains/groups/entities/group-member-entity"
import { GroupMemberRepository } from "@/domains/groups/repositories/group-member-repository"
import { prisma } from "@/infrastuctures/orm/prisma"

@injectable()
export class GroupMemberRepositoryImpl implements GroupMemberRepository {
  async getMembers(
    groupId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<GroupMemberEntity>> {
    const { limit, cursor } = params
    const result = await prisma.groupMember.findMany({
      where: { groupId, leftAt: null },
      include: {
        user: {
          select: {
            profile: {
              select: { name: true, imageUrl: true, lastSeenAt: true },
            },
          },
        },
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
    })

    let nextCursor: string | undefined
    if (result.length > limit) {
      nextCursor = result[result.length - 1].id
      result.pop()
    }

    const data = result.map(
      (member) =>
        new GroupMemberEntity(
          member.userId,
          member.user.profile?.name ?? "Unknown",
          member.isAdmin,
          member.user.profile?.imageUrl ?? undefined,
          member.user.profile?.lastSeenAt ?? undefined,
        ),
    )

    return new SearchResultEntity(data, data.length, nextCursor)
  }
}
