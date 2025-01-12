import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { RoomEntity } from "../entities/room-entity"
import { SearchPrivateRoomEntity } from "../entities/search-private-room-entity"

export abstract class RoomRepository {
  abstract getRooms(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<RoomEntity>>

  abstract getPrivateRooms(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<SearchPrivateRoomEntity>>

  abstract getPinnedRooms(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<RoomEntity>>

  abstract getRoomById(roomId: string): Promise<RoomEntity | null>

  abstract pinRoom(roomId: string): Promise<void>

  abstract unpinRoom(roomId: string): Promise<void>

  abstract getArchivedRooms(
    userId: string,
    params: SearchParamsEntity,
  ): Promise<SearchResultEntity<RoomEntity>>
}
