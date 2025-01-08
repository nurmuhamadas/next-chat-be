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
      orderBy: [{ isAdmin: "desc" }],
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

  async validateUserInGroup(groupId: string, userId: string): Promise<boolean> {
    const result = await prisma.groupMember.count({
      where: { groupId, userId, leftAt: null },
    })

    return result > 0
  }

  async joinGroup(groupId: string, userId: string): Promise<void> {
    const currentRoom = await prisma.room.findFirst({
      where: { groupId, ownerId: userId, deletedAt: null },
    })
    await prisma.$transaction([
      prisma.room.upsert({
        where: { id: currentRoom?.id ?? "" },
        create: {
          groupId,
          ownerId: userId,
          type: "GROUP",
          unreadMessage: {
            create: { count: 0, userId },
          },
        },
        update: {
          deletedAt: null,
          unreadMessage: {
            create: { count: 0, userId },
          },
        },
      }),
      prisma.groupMember.create({
        data: { groupId, userId, isAdmin: false },
      }),
      prisma.groupOption.create({
        data: { groupId, userId, notification: true },
      }),
    ])
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    await prisma.$transaction([
      prisma.groupMember.updateMany({
        where: { groupId, userId, leftAt: null },
        data: { leftAt: new Date(), isAdmin: false },
      }),
      prisma.groupOption.deleteMany({
        where: { groupId, userId },
      }),
      prisma.userUnreadMessage.deleteMany({
        where: { userId, room: { groupId } },
      }),
    ])
  }

  async validateGroupAdmin(groupId: string, userId: string): Promise<boolean> {
    const result = await prisma.groupMember.count({
      where: { groupId, userId, isAdmin: true, leftAt: null },
    })

    return result > 0
  }

  async addAdmin(groupId: string, userId: string): Promise<void> {
    await prisma.groupMember.updateMany({
      where: { groupId, userId, leftAt: null },
      data: { isAdmin: true },
    })
  }

  async removeAdmin(groupId: string, userId: string): Promise<void> {
    await prisma.groupMember.updateMany({
      where: { groupId, userId, leftAt: null },
      data: { isAdmin: false },
    })
  }
}
