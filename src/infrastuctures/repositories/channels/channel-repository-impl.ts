import { ChannelType } from "@prisma/client"
import { injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { ChannelEntity } from "@/domains/channels/entities/channel-entity"
import { ChannelRepository } from "@/domains/channels/repositories/channel-repository"
import { prisma } from "@/infrastuctures/orm/prisma"
import { PrismaHelper } from "@/infrastuctures/orm/prisma-helper"

@injectable()
export class ChannelRepositoryImpl implements ChannelRepository {
  getChannelWhere = (channelId: string, userId: string) => ({
    id: channelId,
    OR: [
      {
        type: ChannelType.PRIVATE,
        subscribers: { some: { userId, unsubscribedAt: null } },
      },
      { type: ChannelType.PUBLIC },
    ],
    deletedAt: null,
  })

  getChannelIncludeQuery = ({ userId }: { userId: string }) => {
    return {
      subscribers: {
        where: { userId, unsubscribedAt: null },
        select: { isAdmin: true },
      },
      _count: {
        select: { subscribers: { where: { unsubscribedAt: null } } },
      },
    }
  }

  async getSubscribedChannels(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<ChannelEntity>> {
    const { limit, cursor, query } = params

    const result = await prisma.channel.findMany({
      where: {
        subscribers: { some: { userId, unsubscribedAt: null } },
        name: { contains: query, mode: "insensitive" },
        deletedAt: null,
      },
      include: { ...this.getChannelIncludeQuery({ userId }) },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
    })

    const data = result.map((v) => {
      return new ChannelEntity(
        v.id,
        v.name,
        PrismaHelper.convertDBChannelType(v.type),
        v.ownerId,
        v.inviteCode,
        v._count.subscribers,
        v.subscribers.length > 0,
        v.subscribers[0]?.isAdmin ?? false,
        v.description ?? undefined,
        v.imageUrl ?? undefined,
      )
    })

    let nextCursor: string | undefined
    if (result.length > limit) {
      nextCursor = result[result.length - 1].id
      result.pop()
    }

    return new SearchResultEntity(data, data.length, nextCursor)
  }
}
