import { RoomType } from "@prisma/client"
import { injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { CommonHelper } from "@/common/lib/common-helper"
import { CreateGroupEntity } from "@/domains/groups/entities/create-group-entity"
import { GroupEntity } from "@/domains/groups/entities/group-entity"
import { GroupSearchEntity } from "@/domains/groups/entities/group-search-entity"
import { GroupRepository } from "@/domains/groups/repositories/group-repository"
import { prisma } from "@/infrastuctures/orm/prisma"
import { PrismaHelper } from "@/infrastuctures/orm/prisma-helper"

@injectable()
export class GroupRepositoryImpl implements GroupRepository {
  private getGroupIncludeQuery = ({ userId }: { userId: string }) => {
    return {
      members: {
        where: { userId, leftAt: null },
        select: { isAdmin: true },
      },
      _count: {
        select: { members: { where: { leftAt: null } } },
      },
    }
  }

  private async generateInviteCode(): Promise<string> {
    let isExist = true
    let inviteCode = CommonHelper.generateInviteCode(10)
    while (isExist) {
      const result = await prisma.group.findUnique({
        where: { inviteCode: inviteCode },
      })
      isExist = !!result
      if (isExist) {
        inviteCode = CommonHelper.generateInviteCode(10)
      }
    }

    return inviteCode
  }

  async getGroups(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<GroupEntity>> {
    const { limit, cursor, query } = params

    const result = await prisma.group.findMany({
      where: {
        members: { some: { userId, leftAt: null } },
        name: { contains: query, mode: "insensitive" },
        deletedAt: null,
      },
      include: { ...this.getGroupIncludeQuery({ userId }) },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
    })

    const data = result.map((v) => {
      return new GroupEntity(
        v.id,
        v.name,
        PrismaHelper.convertDBGroupType(v.type),
        v.ownerId,
        v.inviteCode,
        v._count.members,
        v.members.length > 0,
        v.members[0]?.isAdmin ?? false,
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

  async checkGroupNameAvailability(
    ownerId: string,
    name: string,
  ): Promise<boolean> {
    const result = await prisma.group.count({
      where: { ownerId, name, deletedAt: null },
    })

    return result === 0
  }

  async createGroup(data: CreateGroupEntity): Promise<GroupEntity> {
    const inviteCode = await this.generateInviteCode()

    const result = await prisma.$transaction(async (tx) => {
      const createdGroup = await tx.group.create({
        data: {
          name: data.name,
          type: data.type,
          inviteCode,
          description: data.description,
          imageUrl: data.imageUrl,
          ownerId: data.ownerId,
          membersOption: {
            createMany: {
              data: [
                {
                  userId: data.ownerId,
                  notification: true,
                },
                ...data.memberIds.map((id) => ({
                  userId: id,
                  notification: true,
                })),
              ],
            },
          },
          members: {
            createMany: {
              data: [
                {
                  userId: data.ownerId,
                  isAdmin: true,
                },
                ...data.memberIds.map((id) => ({
                  userId: id,
                  isAdmin: false,
                })),
              ],
            },
          },
          rooms: {
            createMany: {
              data: [
                {
                  type: RoomType.GROUP,
                  ownerId: data.ownerId,
                },
                ...data.memberIds.map((id) => ({
                  type: RoomType.GROUP,
                  ownerId: id,
                })),
              ],
            },
          },
        },
        include: { rooms: { select: { id: true, ownerId: true } } },
      })

      await tx.userUnreadMessage.createMany({
        data: createdGroup.rooms.map((room) => ({
          userId: room.ownerId,
          roomId: room.id,
          count: 0,
        })),
      })

      return createdGroup
    })

    return new GroupEntity(
      result.id,
      result.name,
      PrismaHelper.convertDBGroupType(result.type),
      result.ownerId,
      result.inviteCode,
      0,
      true,
      true,
      result.description ?? undefined,
      result.imageUrl ?? undefined,
    )
  }

  async searchPublicGroups(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<GroupSearchEntity>> {
    const { limit, cursor, query } = params

    const result = await prisma.group.findMany({
      where: {
        type: "PUBLIC",
        members: { none: { userId, leftAt: null } },
        name: { contains: query, mode: "insensitive" },
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        ownerId: true,
        _count: {
          select: { members: { where: { leftAt: null } } },
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
      return new GroupSearchEntity(
        v.id,
        v.name,
        v._count.members,
        v.imageUrl ?? undefined,
      )
    })

    return new SearchResultEntity(data, data.length, nextCursor)
  }
}
