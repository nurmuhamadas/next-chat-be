import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { RoomEntity } from "@/domains/rooms/entities/room-entity"
import { RoomProfileEntity } from "@/domains/rooms/entities/room-profile-entity"
import { RoomRepository } from "@/domains/rooms/repositories/room-repository"
import { prisma } from "@/infrastuctures/orm/prisma"
import { PrismaHelper } from "@/infrastuctures/orm/prisma-helper"

export class RoomRepositoryImpl implements RoomRepository {
  getRoomIncludeQuery = ({ userId }: { userId: string }) => ({
    lastMessage: {
      select: {
        id: true,
        message: true,
        status: true,
        createdAt: true,
        sender: { select: { profile: { select: { name: true } } } },
      },
    },
    privateChat: {
      select: {
        user1: {
          select: {
            id: true,
            profile: { select: { name: true, imageUrl: true } },
          },
        },
        user2: {
          select: {
            id: true,
            profile: { select: { name: true, imageUrl: true } },
          },
        },
      },
    },
    group: {
      select: {
        name: true,
        imageUrl: true,
        members: {
          where: { userId, leftAt: null },
          select: { id: true },
        },
      },
    },
    channel: {
      select: {
        name: true,
        imageUrl: true,
        subscribers: {
          where: { userId, unsubscribedAt: null },
          select: { id: true },
        },
      },
    },
    unreadMessage: { select: { count: true } },
  })

  async getRooms(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<RoomEntity>> {
    const { limit, cursor } = params
    const result = await prisma.room.findMany({
      where: { ownerId: userId, deletedAt: null, archivedAt: null },
      include: {
        ...this.getRoomIncludeQuery({ userId }),
      },
      orderBy: [
        { pinnedAt: { sort: "asc", nulls: "last" } },
        { lastMessageId: { sort: "desc", nulls: "last" } },
        { createdAt: "desc" },
      ],
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
      return new RoomEntity(
        v.id,
        PrismaHelper.convertDBRoomType(v.type),
        v.ownerId,
        !!v.pinnedAt,
        !!v.archivedAt,
        v.unreadMessage?.count ?? 0,
        RoomProfileEntity.fromJSON({
          id: v.privateChat?.user1.id,
          name: v.privateChat?.user1.profile?.name,
          imageUrl: v.privateChat?.user1.profile?.imageUrl,
          isActive: true,
        }),
        RoomProfileEntity.fromJSON({
          id: v.privateChat?.user2.id,
          name: v.privateChat?.user2.profile?.name,
          imageUrl: v.privateChat?.user2.profile?.imageUrl,
          isActive: true,
        }),
        RoomProfileEntity.fromJSON({
          id: v.groupId,
          name: v.group?.name,
          imageUrl: v.group?.imageUrl,
          isActive: v.group ? v.group?.members.length > 0 : false,
        }),
        RoomProfileEntity.fromJSON({
          id: v.channelId,
          name: v.channel?.name,
          imageUrl: v.channel?.imageUrl,
          isActive: v.channel ? v.channel?.subscribers.length > 0 : false,
        }),
      )
    })

    return new SearchResultEntity(data, data.length, nextCursor)
  }
}
