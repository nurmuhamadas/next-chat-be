import { injectable } from "inversify"

import { CreatePrivateChatEntity } from "@/domains/private-chat/entites/create-private-chat-entity"
import { PrivateChatEntity } from "@/domains/private-chat/entites/private-chat-entity"
import { PrivateChatRepository } from "@/domains/private-chat/repositories/private-chat-repository"
import { prisma } from "@/infrastuctures/orm/prisma"

@injectable()
export class PrivateChatRepositoryImpl implements PrivateChatRepository {
  async create(data: CreatePrivateChatEntity): Promise<PrivateChatEntity> {
    const result = await prisma.privateChat.create({
      data: { user1Id: data.userId1, user2Id: data.userId2 },
    })

    return new PrivateChatEntity(result.id, result.user1Id, result.user2Id)
  }

  async getByUserIds(
    userId1: string,
    userId2: string,
  ): Promise<PrivateChatEntity | null> {
    const result = await prisma.privateChat.findFirst({
      where: {
        OR: [
          { user1Id: userId1, user2Id: userId2 },
          { user1Id: userId2, user2Id: userId1 },
        ],
      },
    })

    if (!result) return null

    return new PrivateChatEntity(result.id, result.user1Id, result.user2Id)
  }

  async deleteByUserIds(userId1: string, userId2: string): Promise<void> {
    await prisma.privateChat.deleteMany({
      where: {
        OR: [
          { user1Id: userId1, user2Id: userId2 },
          { user1Id: userId2, user2Id: userId1 },
        ],
      },
    })
  }
}
