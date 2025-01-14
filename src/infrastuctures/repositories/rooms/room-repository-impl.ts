import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { CreateRoomEntity } from "@/domains/rooms/entities/create-room-entity"
import { RoomType } from "@/domains/rooms/entities/enums"
import { LastMessageEntity } from "@/domains/rooms/entities/last-message-entity"
import { RoomEntity } from "@/domains/rooms/entities/room-entity"
import { RoomProfileEntity } from "@/domains/rooms/entities/room-profile-entity"
import { SearchPrivateRoomEntity } from "@/domains/rooms/entities/search-private-room-entity"
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
      nextCursor = result.pop()?.id
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
        v.lastMessage
          ? new LastMessageEntity(
              v.lastMessage.id,
              v.lastMessage.createdAt,
              v.lastMessage.sender.profile?.name ?? "Unknown",
              v.lastMessage.message ?? undefined,
            )
          : undefined,
      )
    })

    return new SearchResultEntity(data, data.length, nextCursor)
  }

  async getPrivateRooms(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<SearchPrivateRoomEntity>> {
    const { limit, cursor, query } = params
    const result = await prisma.room.findMany({
      where: {
        OR: [
          {
            privateChat: {
              user1: { profile: { name: { contains: query } } },
            },
          },
          {
            privateChat: {
              user2: { profile: { name: { contains: query } } },
            },
          },
        ],
        ownerId: userId,
        deletedAt: null,
        archivedAt: null,
      },
      include: {
        privateChat: {
          select: {
            user1: {
              select: {
                id: true,
                profile: {
                  select: { name: true, imageUrl: true, lastSeenAt: true },
                },
              },
            },
            user2: {
              select: {
                id: true,
                profile: {
                  select: { name: true, imageUrl: true, lastSeenAt: true },
                },
              },
            },
          },
        },
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
      nextCursor = result.pop()?.id
    }

    const data = result.map((v) => {
      return new SearchPrivateRoomEntity(
        v.ownerId,
        RoomProfileEntity.fromJSON({
          id: v.privateChat?.user1.id,
          name: v.privateChat?.user1.profile?.name,
          imageUrl: v.privateChat?.user1.profile?.imageUrl,
          isActive: false,
          lastSeenAt: v.privateChat?.user1.profile?.lastSeenAt
            ? v.privateChat?.user1.profile?.lastSeenAt.toISOString()
            : undefined,
        }),
        RoomProfileEntity.fromJSON({
          id: v.privateChat?.user2.id,
          name: v.privateChat?.user2.profile?.name,
          imageUrl: v.privateChat?.user2.profile?.imageUrl,
          isActive: false,
          lastSeenAt: v.privateChat?.user2.profile?.lastSeenAt
            ? v.privateChat?.user2.profile?.lastSeenAt.toISOString()
            : undefined,
        }),
      )
    })

    return new SearchResultEntity(data, data.length, nextCursor)
  }

  async getPinnedRooms(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<RoomEntity>> {
    const { limit, cursor } = params
    const result = await prisma.room.findMany({
      where: {
        ownerId: userId,
        deletedAt: null,
        archivedAt: null,
        pinnedAt: { not: null },
      },
      include: { ...this.getRoomIncludeQuery({ userId }) },
      orderBy: [
        { lastMessageId: { sort: "desc", nulls: "first" } },
        { createdAt: "desc" },
      ],
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
    })

    let nextCursor: string | undefined
    if (result.length > limit) {
      nextCursor = result.pop()?.id
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

  async getRoomById(roomId: string): Promise<RoomEntity | null> {
    const result = await prisma.room.findUnique({
      where: { id: roomId },
    })

    if (!result) return null

    return new RoomEntity(
      result.id,
      PrismaHelper.convertDBRoomType(result.type),
      result.ownerId,
      !!result.pinnedAt,
      !!result.archivedAt,
      0,
    )
  }

  async pinRoom(roomId: string): Promise<void> {
    await prisma.room.updateMany({
      where: { id: roomId },
      data: { pinnedAt: new Date() },
    })
  }

  async unpinRoom(roomId: string): Promise<void> {
    await prisma.room.updateMany({
      where: { id: roomId },
      data: { pinnedAt: null },
    })
  }

  async getArchivedRooms(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<RoomEntity>> {
    const { limit, cursor } = params

    const result = await prisma.room.findMany({
      where: {
        ownerId: userId,
        deletedAt: null,
        pinnedAt: null,
        archivedAt: { not: null },
      },
      include: { ...this.getRoomIncludeQuery({ userId }) },
      orderBy: [
        { lastMessageId: { sort: "desc", nulls: "first" } },
        { createdAt: "desc" },
      ],
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
    })

    let nextCursor: string | undefined
    if (result.length > limit) {
      nextCursor = result.pop()?.id
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

  async archiveRoom(roomId: string): Promise<void> {
    await prisma.room.update({
      where: { id: roomId },
      data: { archivedAt: new Date(), pinnedAt: null },
    })
  }

  async unarchiveRoom(roomId: string): Promise<void> {
    await prisma.room.update({
      where: { id: roomId },
      data: { archivedAt: null },
    })
  }

  async getRoomByActionId(
    userId: string,
    actionId: string,
  ): Promise<RoomEntity | null> {
    const result = await prisma.room.findFirst({
      where: {
        ownerId: userId,
        OR: [
          { privateChat: { user1Id: actionId, user2Id: userId } },
          { privateChat: { user2Id: actionId, user1Id: userId } },
          { groupId: actionId },
          { channelId: actionId },
        ],
        deletedAt: null,
      },
      include: { ...this.getRoomIncludeQuery({ userId }) },
    })

    if (!result) return null

    return new RoomEntity(
      result.id,
      PrismaHelper.convertDBRoomType(result.type),
      result.ownerId,
      !!result.pinnedAt,
      !!result.archivedAt,
      result.unreadMessage?.count ?? 0,
      RoomProfileEntity.fromJSON({
        id: result.privateChat?.user1.id,
        name: result.privateChat?.user1.profile?.name,
        imageUrl: result.privateChat?.user1.profile?.imageUrl,
        isActive: true,
      }),
      RoomProfileEntity.fromJSON({
        id: result.privateChat?.user2.id,
        name: result.privateChat?.user2.profile?.name,
        imageUrl: result.privateChat?.user2.profile?.imageUrl,
        isActive: true,
      }),
      RoomProfileEntity.fromJSON({
        id: result.groupId,
        name: result.group?.name,
        imageUrl: result.group?.imageUrl,
        isActive: result.group ? result.group?.members.length > 0 : false,
      }),
      RoomProfileEntity.fromJSON({
        id: result.channelId,
        name: result.channel?.name,
        imageUrl: result.channel?.imageUrl,
        isActive: result.channel
          ? result.channel?.subscribers.length > 0
          : false,
      }),
    )
  }

  async deleteRoom(
    id: string,
    ownerId: string,
    type: RoomType,
    userId1?: string,
    userId2?: string,
    groupId?: string,
    channelId?: string,
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      if (type === "PRIVATE") {
        await tx.privateChatOption.deleteMany({
          where: {
            privateChat: {
              user1Id: userId1,
              user2Id: userId2,
            },
            userId: ownerId,
          },
        })
      } else if (type === "GROUP") {
        await tx.groupMember.deleteMany({ where: { userId: ownerId, groupId } })
        await tx.groupOption.deleteMany({ where: { userId: ownerId, groupId } })
      } else if (type === "CHANNEL") {
        await tx.channelSubscriber.deleteMany({
          where: { userId: ownerId, channelId },
        })
        await tx.channelOption.deleteMany({
          where: { userId: ownerId, channelId },
        })
      }

      await tx.room.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          unreadMessage: {
            upsert: {
              create: { count: 0, userId: ownerId },
              update: { count: 0 },
            },
          },
        },
      })
    })
  }

  async updateLastMessage(roomId: string, messageId: string): Promise<void> {
    await prisma.room.update({
      where: { id: roomId },
      data: { deletedAt: null, lastMessageId: messageId },
    })
  }

  async createRoom(data: CreateRoomEntity): Promise<RoomEntity> {
    const result = await prisma.room.create({
      data: {
        type: data.type,
        ownerId: data.ownerId,
        privateChatId:
          data.type === "PRIVATE" && data.privateChatId
            ? data.privateChatId
            : undefined,
        groupId:
          data.type === "GROUP" && data.groupId ? data.groupId : undefined,
        channelId:
          data.type === "CHANNEL" && data.channelId
            ? data.channelId
            : undefined,
        unreadMessage: {
          create: { count: data.totalUnreadMessage, userId: data.ownerId },
        },
      },
      include: { ...this.getRoomIncludeQuery({ userId: data.ownerId }) },
    })

    return new RoomEntity(
      result.id,
      PrismaHelper.convertDBRoomType(result.type),
      result.ownerId,
      !!result.pinnedAt,
      !!result.archivedAt,
      result.unreadMessage?.count ?? 0,
      RoomProfileEntity.fromJSON({
        id: result.privateChat?.user1.id,
        name: result.privateChat?.user1.profile?.name,
        imageUrl: result.privateChat?.user1.profile?.imageUrl,
        isActive: true,
      }),
      RoomProfileEntity.fromJSON({
        id: result.privateChat?.user2.id,
        name: result.privateChat?.user2.profile?.name,
        imageUrl: result.privateChat?.user2.profile?.imageUrl,
        isActive: true,
      }),
      RoomProfileEntity.fromJSON({
        id: result.groupId,
        name: result.group?.name,
        imageUrl: result.group?.imageUrl,
        isActive: result.group ? result.group?.members.length > 0 : false,
      }),
      RoomProfileEntity.fromJSON({
        id: result.channelId,
        name: result.channel?.name,
        imageUrl: result.channel?.imageUrl,
        isActive: result.channel
          ? result.channel?.subscribers.length > 0
          : false,
      }),
    )
  }

  async updateGroupLastMessage(
    groupId: string,
    messageId: string,
  ): Promise<void> {
    await prisma.room.updateMany({
      where: { groupId, type: "GROUP" },
      data: { lastMessageId: messageId },
    })
  }

  async updateChannelLastMessage(
    groupId: string,
    messageId: string,
  ): Promise<void> {
    await prisma.room.updateMany({
      where: { channelId: groupId, type: "CHANNEL" },
      data: { lastMessageId: messageId },
    })
  }
}
