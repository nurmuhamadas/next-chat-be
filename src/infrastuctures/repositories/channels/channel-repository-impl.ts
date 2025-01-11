import { ChannelType } from "@prisma/client"
import { injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { CommonHelper } from "@/common/lib/common-helper"
import { ChannelEntity } from "@/domains/channels/entities/channel-entity"
import { ChannelSearchEntity } from "@/domains/channels/entities/channel-search-entity"
import { CreateChannelEntity } from "@/domains/channels/entities/create-channel-entity"
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

  private async generateInviteCode(): Promise<string> {
    let isExist = true
    let inviteCode = CommonHelper.generateInviteCode(10)
    while (isExist) {
      const result = await prisma.channel.findUnique({
        where: { inviteCode: inviteCode },
      })
      isExist = !!result
      if (isExist) {
        inviteCode = CommonHelper.generateInviteCode(10)
      }
    }

    return inviteCode
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

  async checkChannelNameAvailability(
    ownerId: string,
    name: string,
  ): Promise<boolean> {
    const result = await prisma.channel.count({
      where: { ownerId, name, deletedAt: null },
    })

    return result === 0
  }

  async createChannel(data: CreateChannelEntity): Promise<ChannelEntity> {
    const inviteCode = await this.generateInviteCode()

    const result = await prisma.channel.create({
      data: {
        name: data.name,
        type: data.type,
        inviteCode,
        description: data.description,
        imageUrl: data.imageUrl,
        ownerId: data.ownerId,
        subscribersOption: {
          create: {
            userId: data.ownerId,
            notification: true,
          },
        },
        subscribers: {
          create: {
            userId: data.ownerId,
            isAdmin: true,
          },
        },
        rooms: {
          create: {
            type: "CHANNEL",
            ownerId: data.ownerId,
            unreadMessage: {
              create: {
                userId: data.ownerId,
                count: 0,
              },
            },
          },
        },
      },
      include: { rooms: { select: { id: true, ownerId: true } } },
    })

    return new ChannelEntity(
      result.id,
      result.name,
      PrismaHelper.convertDBChannelType(result.type),
      result.ownerId,
      result.inviteCode,
      1,
      true,
      true,
      result.description ?? undefined,
      result.imageUrl ?? undefined,
    )
  }

  async searchPublicChannels(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<ChannelSearchEntity>> {
    const { limit, cursor, query } = params

    const result = await prisma.channel.findMany({
      where: {
        type: "PUBLIC",
        subscribers: { none: { userId, unsubscribedAt: null } },
        name: { contains: query, mode: "insensitive" },
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        _count: {
          select: { subscribers: { where: { unsubscribedAt: null } } },
        },
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
    })

    let nextCursor: string | undefined
    if (result.length > limit) {
      nextCursor = result[result.length - 1].id
      result.pop()
    }

    const data = result.map((v) => {
      return new ChannelSearchEntity(
        v.id,
        v.name,
        v._count.subscribers,
        v.imageUrl ?? undefined,
      )
    })

    return new SearchResultEntity(data, data.length, nextCursor)
  }
}
