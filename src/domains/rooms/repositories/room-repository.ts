import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { RoomEntity } from "../entities/room-entity"

export abstract class RoomRepository {
  abstract getRooms(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<RoomEntity>>
}
