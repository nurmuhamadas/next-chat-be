import { injectable } from "inversify"

import { PrivateChatOptionEntity } from "@/domains/private-chat/entites/private-chat-option-entity"
import { UpdatePrivateChatOptionEntity } from "@/domains/private-chat/entites/update-private-chat-option-entity"
import { PrivateChatOptionRepository } from "@/domains/private-chat/repositories/private-chat-option-repository"
import { prisma } from "@/infrastuctures/orm/prisma"

@injectable()
export class PrivateChatOptionRepositoryImpl
  implements PrivateChatOptionRepository
{
  async getPrivateChatOptionByUserId(
    userId: string,
    userPairId: string,
  ): Promise<PrivateChatOptionEntity | null> {
    const result = await prisma.privateChatOption.findFirst({
      where: {
        userId,
        deletedAt: null,
        privateChat: {
          OR: [
            { user1Id: userPairId, user2Id: userId },
            { user2Id: userPairId, user1Id: userId },
          ],
        },
      },
    })

    if (!result) return null

    return new PrivateChatOptionEntity(
      result.id,
      result.userId,
      result.privateChatId,
      result.notification,
    )
  }

  async updatePrivateChatOption(
    id: string,
    option: UpdatePrivateChatOptionEntity,
  ): Promise<PrivateChatOptionEntity> {
    const result = await prisma.privateChatOption.update({
      where: { id },
      data: { notification: option.notification },
    })

    return new PrivateChatOptionEntity(
      result.id,
      result.userId,
      result.privateChatId,
      result.notification,
    )
  }
}
