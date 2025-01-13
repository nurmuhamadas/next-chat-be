import { inject, injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { SearchPrivateRoomEntity } from "@/domains/rooms/entities/search-private-room-entity"
import { RoomRepository } from "@/domains/rooms/repositories/room-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetPrivateRooms {
  constructor(
    @inject(KEYS.RoomRepository) private roomRepository: RoomRepository,
  ) {}

  async execute(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<SearchPrivateRoomEntity>> {
    return this.roomRepository.getPrivateRooms(userId, params)
  }
}
