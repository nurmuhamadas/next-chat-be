import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { RoomEntity } from "@/domains/rooms/entities/room-entity"
import { RoomRepository } from "@/domains/rooms/repositories/room-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetRoomByActionId {
  constructor(
    @inject(KEYS.RoomRepository) private roomRepository: RoomRepository,
  ) {}

  async execute(userId: string, actionId: string): Promise<RoomEntity> {
    const room = await this.roomRepository.getRoomByActionId(userId, actionId)

    if (!room) {
      throw new NotFoundError(ERROR.ROOM_NOT_FOUND)
    }
    if (room.ownerId !== userId) {
      throw new AuthorizationError(ERROR.NOT_ALLOWED)
    }

    return room
  }
}
