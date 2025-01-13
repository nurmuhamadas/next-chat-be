import { inject, injectable } from "inversify"

import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"
import { RoomEntity } from "@/domains/rooms/entities/room-entity"
import { RoomRepository } from "@/domains/rooms/repositories/room-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class GetRooms {
  constructor(
    @inject(KEYS.RoomRepository) private roomRepository: RoomRepository,
  ) {}

  async execute(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<RoomEntity>> {
    return this.roomRepository.getRooms(userId, params)
  }
}
