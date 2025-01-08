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
}
