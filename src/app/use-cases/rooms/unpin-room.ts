import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import AuthorizationError from "@/common/exceptions/authorization-error"
import InvariantError from "@/common/exceptions/invariant-error"
import NotFoundError from "@/common/exceptions/not-found-error"
import { RoomRepository } from "@/domains/rooms/repositories/room-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class UnpinRoom {
  constructor(
    @inject(KEYS.RoomRepository) private roomRepository: RoomRepository,
  ) {}

  async execute(userId: string, roomId: string): Promise<void> {
    const room = await this.roomRepository.getRoomById(roomId)

    if (!room) {
      throw new NotFoundError(ERROR.ROOM_NOT_FOUND)
    }
    if (room.ownerId !== userId) {
      throw new AuthorizationError(ERROR.NOT_ALLOWED)
    }
    if (!room.pinned) {
      throw new InvariantError(ERROR.ROOM_NOT_PINNED)
    }

    await this.roomRepository.unpinRoom(userId, roomId)
  }
}
