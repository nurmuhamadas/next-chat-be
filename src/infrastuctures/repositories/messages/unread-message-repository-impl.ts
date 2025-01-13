import { injectable } from "inversify"

import { UnreadMessageRepository } from "@/domains/messages/repositories/unread-message-repository"
import { prisma } from "@/infrastuctures/orm/prisma"

@injectable()
export class UnreadMessageRepositoryImpl implements UnreadMessageRepository {
  async readMessage(userId: string, receiverId: string): Promise<void> {
    await prisma.userUnreadMessage.updateMany({
      where: {
        userId,
        room: {
          OR: [
            {
              privateChat: {
                OR: [
                  { user1Id: receiverId, user2Id: userId },
                  { user2Id: receiverId, user1Id: userId },
                ],
              },
            },
            { groupId: receiverId },
            { channelId: receiverId },
          ],
        },
      },
      data: { count: 0 },
    })
  }

  async incrementUnreadMessageCount(
    userId: string,
    receiverId: string,
  ): Promise<void> {
    await prisma.userUnreadMessage.updateMany({
      where: {
        room: {
          ownerId: { not: userId },
          OR: [
            {
              privateChat: {
                OR: [
                  { user1Id: receiverId, user2Id: userId },
                  { user2Id: receiverId, user1Id: userId },
                ],
              },
            },
            { groupId: receiverId },
            { channelId: receiverId },
          ],
        },
      },
      data: { count: { increment: 1 } },
    })
  }

  async deleteRecords(userId: string, receiverId: string): Promise<void> {
    await prisma.userUnreadMessage.deleteMany({
      where: {
        room: {
          ownerId: { not: userId },
          OR: [
            {
              privateChat: {
                OR: [
                  { user1Id: receiverId, user2Id: userId },
                  { user2Id: receiverId, user1Id: userId },
                ],
              },
            },
            { groupId: receiverId },
            { channelId: receiverId },
          ],
        },
      },
    })
  }
}
