import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { ChannelSubscriberEntity } from "@/domains/channels/entities/channel-subscriber-entity"
import { ChannelSubscriberRepository } from "@/domains/channels/repositories/channel-subscriber-repository"
import { prisma } from "@/infrastuctures/orm/prisma"

export class ChannelSubscriberRepositoryImpl
  implements ChannelSubscriberRepository
{
  async getSubscribers(
    channelId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<ChannelSubscriberEntity>> {
    const { limit, cursor } = params
    const result = await prisma.channelSubscriber.findMany({
      where: { channelId, unsubscribedAt: null },
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
      (subscriber) =>
        new ChannelSubscriberEntity(
          subscriber.userId,
          subscriber.user.profile?.name ?? "Unknown",
          subscriber.isAdmin,
          subscriber.user.profile?.imageUrl ?? undefined,
          subscriber.user.profile?.lastSeenAt ?? undefined,
        ),
    )

    return new SearchResultEntity(data, data.length, nextCursor)
  }

  async validateUserSubscriptionToChannel(
    channelId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await prisma.channelSubscriber.count({
      where: { channelId, userId, unsubscribedAt: null },
    })

    return result > 0
  }

  async validateChannelAdmin(
    channelId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await prisma.channelSubscriber.count({
      where: { channelId, userId, isAdmin: true, unsubscribedAt: null },
    })

    return result > 0
  }

  async addAdmin(channelId: string, userId: string): Promise<void> {
    await prisma.channelSubscriber.updateMany({
      where: { channelId, userId, unsubscribedAt: null },
      data: { isAdmin: true },
    })
  }

  async removeAdmin(channelId: string, userId: string): Promise<void> {
    await prisma.channelSubscriber.updateMany({
      where: { channelId, userId, unsubscribedAt: null },
      data: { isAdmin: false },
    })
  }

  async subscribeChannel(channelId: string, userId: string): Promise<void> {
    const currentRoom = await prisma.room.findFirst({
      where: { channelId, ownerId: userId, deletedAt: null },
    })
    await prisma.$transaction([
      prisma.room.upsert({
        where: { id: currentRoom?.id ?? "" },
        create: {
          channelId,
          ownerId: userId,
          type: "CHANNEL",
          unreadMessage: {
            create: {
              userId,
              count: 0,
            },
          },
        },
        update: {
          deletedAt: null,
          unreadMessage: {
            create: {
              userId,
              count: 0,
            },
          },
        },
      }),
      prisma.channelSubscriber.create({
        data: { channelId, userId, isAdmin: false },
      }),
      prisma.channelOption.create({
        data: { channelId, userId, notification: true },
      }),
    ])
  }
}
