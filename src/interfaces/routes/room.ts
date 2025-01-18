import { Hono } from "hono"

import { ArchiveRoom } from "@/app/use-cases/rooms/archive-room"
import { DeleteRoom } from "@/app/use-cases/rooms/delete-room"
import { GetArchivedRooms } from "@/app/use-cases/rooms/get-archived-rooms"
import { GetPinnedRooms } from "@/app/use-cases/rooms/get-pinned-rooms"
import { GetPrivateRooms } from "@/app/use-cases/rooms/get-private-rooms"
import { GetRoomByActionId } from "@/app/use-cases/rooms/get-room-by-action-id"
import { GetRooms } from "@/app/use-cases/rooms/get-rooms"
import { PinRoom } from "@/app/use-cases/rooms/pin-room"
import { UnarchiveRoom } from "@/app/use-cases/rooms/unarchive-room"
import { UnpinRoom } from "@/app/use-cases/rooms/unpin-room"
import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import {
  successCollectionResponse,
  successResponse,
  zValidator,
} from "@/common/lib/utils"
import { container } from "@/infrastuctures/container"

import { searchQuerySchema } from "../schemas/common-schema"

import { sessionMiddleware } from "./middleware/session-middleware"

const roomRoute = new Hono()
  .get(
    "/",
    zValidator("query", searchQuerySchema),
    sessionMiddleware,
    async (c) => {
      const params = c.req.valid("query")
      const session = c.get("userSession")

      const getRooms = container.get(GetRooms)
      const result = await getRooms.execute(
        session.userId,
        SearchParamsEntity.fromJSON(params),
      )

      const response: GetRoomListResponse = successCollectionResponse(
        result.data.map((v) => v.toDTO()),
        result.total,
        result.cursor,
      )
      return c.json(response)
    },
  )
  .get(
    "/private",
    zValidator("query", searchQuerySchema),
    sessionMiddleware,
    async (c) => {
      const params = c.req.valid("query")
      const session = c.get("userSession")

      const getPrivateRooms = container.get(GetPrivateRooms)
      const result = await getPrivateRooms.execute(
        session.userId,
        SearchParamsEntity.fromJSON(params),
      )

      const response: GetPrivateRoomsResponse = successCollectionResponse(
        result.data.map((v) => v.toDTO()),
        result.total,
        result.cursor,
      )
      return c.json(response)
    },
  )
  .get(
    "/pinned",
    zValidator("query", searchQuerySchema),
    sessionMiddleware,
    async (c) => {
      const params = c.req.valid("query")
      const session = c.get("userSession")

      const getPinnedRooms = container.get(GetPinnedRooms)
      const result = await getPinnedRooms.execute(
        session.userId,
        SearchParamsEntity.fromJSON(params),
      )

      const response: GetRoomListResponse = successCollectionResponse(
        result.data.map((v) => v.toDTO()),
        result.total,
        result.cursor,
      )
      return c.json(response)
    },
  )
  .post("/pinned/:roomId", sessionMiddleware, async (c) => {
    const { roomId } = c.req.param()
    const session = c.get("userSession")

    const pinRoom = container.get(PinRoom)
    await pinRoom.execute(session.userId, roomId)

    const response: PinRoomResponse = successResponse(true)
    return c.json(response)
  })
  .delete("/pinned/:roomId", sessionMiddleware, async (c) => {
    const { roomId } = c.req.param()
    const session = c.get("userSession")

    const unpinRoom = container.get(UnpinRoom)
    await unpinRoom.execute(session.userId, roomId)

    const response: UnpinRoomResponse = successResponse(true)
    return c.json(response)
  })
  .get(
    "/archived",
    zValidator("query", searchQuerySchema),
    sessionMiddleware,
    async (c) => {
      const params = c.req.valid("query")
      const session = c.get("userSession")

      const getArchivedRooms = container.get(GetArchivedRooms)
      const result = await getArchivedRooms.execute(
        session.userId,
        SearchParamsEntity.fromJSON(params),
      )

      const response: GetRoomListResponse = successCollectionResponse(
        result.data.map((v) => v.toDTO()),
        result.total,
        result.cursor,
      )
      return c.json(response)
    },
  )
  .post("/archived/:roomId", sessionMiddleware, async (c) => {
    const { roomId } = c.req.param()
    const session = c.get("userSession")

    const archiveRoom = container.get(ArchiveRoom)
    await archiveRoom.execute(session.userId, roomId)

    const response: ArchiveRoomResponse = successResponse(true)
    return c.json(response)
  })
  .delete("/archived/:roomId", sessionMiddleware, async (c) => {
    const { roomId } = c.req.param()
    const session = c.get("userSession")

    const unarchiveRoom = container.get(UnarchiveRoom)
    await unarchiveRoom.execute(session.userId, roomId)

    const response: UnarchiveRoomResponse = successResponse(true)
    return c.json(response)
  })
  .get("/:actionId", sessionMiddleware, async (c) => {
    const { actionId } = c.req.param()
    const session = c.get("userSession")

    const getRoomByActionId = container.get(GetRoomByActionId)
    const result = await getRoomByActionId.execute(session.userId, actionId)

    const response: GetRoomResponse = successResponse(result.toDTO())
    return c.json(response)
  })
  .delete("/:roomId", sessionMiddleware, async (c) => {
    const { roomId } = c.req.param()
    const session = c.get("userSession")

    const deleteRoom = container.get(DeleteRoom)
    const result = await deleteRoom.execute(session.userId, roomId)

    const response: DeleteRoomResponse = successResponse({
      id: result.id,
    })
    return c.json(response)
  })

export default roomRoute
