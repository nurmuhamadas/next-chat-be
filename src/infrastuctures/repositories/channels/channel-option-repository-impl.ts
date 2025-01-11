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
}
