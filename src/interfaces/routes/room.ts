import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { GetPrivateRooms } from "@/app/use-cases/rooms/get-private-rooms"
import { GetRooms } from "@/app/use-cases/rooms/get-rooms"
import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { successCollectionResponse } from "@/common/lib/utils"
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

export default roomRoute
