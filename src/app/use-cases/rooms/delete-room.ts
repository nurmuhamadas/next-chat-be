import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { ChannelSubscriberRepository } from "@/domains/channels/repositories/channel-subscriber-repository"
import { GroupMemberRepository } from "@/domains/groups/repositories/group-member-repository"
import { RoomEntity } from "@/domains/rooms/entities/room-entity"
import { RoomRepository } from "@/domains/rooms/repositories/room-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class DeleteRoom {
  constructor(
    @inject(KEYS.RoomRepository) private roomRepository: RoomRepository,
    @inject(KEYS.GroupMemberRepository)
    private groupMemberRepository: GroupMemberRepository,
    @inject(KEYS.ChannelSubscriberRepository)
    private channelSubscriberRepository: ChannelSubscriberRepository,
  ) {}

  async execute(userId: string, roomId: string): Promise<RoomEntity> {
    const room = await this.roomRepository.getRoomById(roomId)

    if (!room) {
      throw new NotFoundError(ERROR.ROOM_NOT_FOUND)
    }
    if (room.ownerId !== userId) {
      throw new AuthorizationError(ERROR.NOT_ALLOWED)
    }

    // * Can only delete room if already left group or unsubscribed channel
    if (room.type === "GROUP" && room.group) {
      const isMember = await this.groupMemberRepository.validateUserInGroup(
        room.group.id,
        userId,
      )
      if (isMember) {
        throw new AuthorizationError(ERROR.CANNOT_DELETE_JOINED_GROUP)
      }
    } else if (room.type === "CHANNEL" && room.channel) {
      const isSubscriber =
        await this.channelSubscriberRepository.validateUserSubscriptionToChannel(
          room.channel.id,
          userId,
        )
      if (isSubscriber) {
        throw new AuthorizationError(ERROR.CANNOT_DELETE_SUBSCRIBED_CHANNEL)
      }
    }

    this.roomRepository.deleteRoom(
      room.id,
      room.ownerId,
      room.type,
      room.user1?.id,
      room.user2?.id,
      room.group?.id,
      room.channel?.id,
    )

    return room
  }
}
