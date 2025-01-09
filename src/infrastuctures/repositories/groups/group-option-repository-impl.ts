import { GroupOptionEntity } from "@/domains/groups/entities/group-option-entity"
import { UpdateGroupOptionEntity } from "@/domains/groups/entities/update-group-option-entity"
import { GroupOptionRepository } from "@/domains/groups/repositories/group-option-repository"
import { prisma } from "@/infrastuctures/orm/prisma"

export class GroupOptionRepositoryImpl implements GroupOptionRepository {
  async clearAllChats(
    groupId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<void> {
    await prisma.$transaction([
      prisma.groupMember.deleteMany({ where: { userId, groupId } }),
      prisma.groupMember.create({
        data: { userId, groupId, isAdmin },
      }),
      prisma.userUnreadMessage.updateMany({
        where: { userId, room: { groupId } },
        data: { count: 0 },
      }),
    ])
  }

  async getOption(
    groupId: string,
    userId: string,
  ): Promise<GroupOptionEntity | null> {
    const option = await prisma.groupOption.findFirst({
      where: { groupId, userId },
      orderBy: { createdAt: "desc" },
    })

    if (!option) return null

    return new GroupOptionEntity(
      option.id,
      option.groupId,
      option.userId,
      option.notification,
    )
  }

  async createOrUpdateOption(
    data: UpdateGroupOptionEntity,
    id = "",
  ): Promise<GroupOptionEntity> {
    const result = await prisma.groupOption.upsert({
      where: { id },
      create: {
        groupId: data.groupId,
        userId: data.userId,
        notification: data.notification,
      },
      update: {
        notification: data.notification,
      },
    })

    return new GroupOptionEntity(
      result.id,
      result.groupId,
      result.userId,
      result.notification,
    )
  }
}
