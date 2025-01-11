import { ChannelOptionEntity } from "@/domains/channels/entities/channel-option-entity"
import { UpdateChannelOptionEntity } from "@/domains/channels/entities/update-channel-option-entity"
import { ChannelOptionRepository } from "@/domains/channels/repositories/channel-option-repository"
import { prisma } from "@/infrastuctures/orm/prisma"

export class ChannelOptionRepositoryImpl implements ChannelOptionRepository {
  async clearAllChats(
    channelId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<void> {
    await prisma.$transaction([
      prisma.channelSubscriber.deleteMany({ where: { userId, channelId } }),
      prisma.channelSubscriber.create({
        data: { userId, channelId, isAdmin },
      }),
      prisma.userUnreadMessage.updateMany({
        where: { userId, room: { channelId } },
        data: { count: 0 },
      }),
    ])
  }

  async getOption(
    channelId: string,
    userId: string,
  ): Promise<ChannelOptionEntity | null> {
    const option = await prisma.channelOption.findFirst({
      where: { channelId, userId },
      orderBy: { createdAt: "desc" },
    })

    if (!option) return null

    return new ChannelOptionEntity(
      option.id,
      option.channelId,
      option.userId,
      option.notification,
    )
  }

  async createOrUpdateOption(
    data: UpdateChannelOptionEntity,
    id = "",
  ): Promise<ChannelOptionEntity> {
    const result = await prisma.channelOption.upsert({
      where: { id },
      create: {
        channelId: data.channelId,
        userId: data.userId,
        notification: data.notification,
      },
      update: {
        notification: data.notification,
      },
    })

    return new ChannelOptionEntity(
      result.id,
      result.channelId,
      result.userId,
      result.notification,
    )
  }
}
