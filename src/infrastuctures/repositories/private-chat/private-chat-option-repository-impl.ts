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
      result.createdAt,
      result.deletedAt ?? undefined,
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
      result.createdAt,
      result.deletedAt ?? undefined,
    )
  }

  async clearAllOptionAndCreateNewOne(
    lastOption: PrivateChatOptionEntity,
  ): Promise<PrivateChatOptionEntity> {
    const [, newOption] = await prisma.$transaction([
      prisma.privateChatOption.deleteMany({
        where: { userId: lastOption.userId },
      }),
      prisma.privateChatOption.create({
        data: {
          userId: lastOption.userId,
          privateChatId: lastOption.privateChatId,
          notification: lastOption.notification,
        },
      }),
    ])

    return new PrivateChatOptionEntity(
      newOption.id,
      newOption.userId,
      newOption.privateChatId,
      newOption.notification,
      newOption.createdAt,
      newOption.deletedAt ?? undefined,
    )
  }

  async getOptionsHistory(
    userId: string,
    userPairId: string,
  ): Promise<PrivateChatOptionEntity[]> {
    const result = await prisma.privateChatOption.findMany({
      where: {
        userId,
        privateChat: {
          OR: [
            { user1Id: userPairId, user2Id: userId },
            { user2Id: userPairId, user1Id: userId },
          ],
        },
      },
    })

    return result.map(
      (opt) =>
        new PrivateChatOptionEntity(
          opt.id,
          opt.userId,
          opt.privateChatId,
          opt.notification,
          opt.createdAt,
          opt.deletedAt ?? undefined,
        ),
    )
  }
}
