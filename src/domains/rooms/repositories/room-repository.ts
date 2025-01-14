import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { SearchResultEntity } from "@/common/entities/search-result-entity"

import { CreateRoomEntity } from "../entities/create-room-entity"
import { RoomType } from "../entities/enums"
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

  abstract archiveRoom(roomId: string): Promise<void>

  abstract unarchiveRoom(roomId: string): Promise<void>

  abstract getRoomByActionId(
    userId: string,
    actionId: string,
  ): Promise<RoomEntity | null>

  abstract deleteRoom(
    id: string,
    ownerId: string,
    type: RoomType,
    userId1?: string,
    userId2?: string,
    groupId?: string,
    channelId?: string,
  ): Promise<void>

  abstract updateLastMessage(roomId: string, messageId: string): Promise<void>

  abstract createRoom(data: CreateRoomEntity): Promise<RoomEntity>
}
