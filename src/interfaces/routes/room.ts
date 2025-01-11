import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { GetRooms } from "@/app/use-cases/rooms/get-rooms"
import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { successCollectionResponse } from "@/common/lib/utils"
import { container } from "@/infrastuctures/container"

import { searchQuerySchema } from "../schemas/common-schema"

import { sessionMiddleware } from "./middleware/session-middleware"

const roomRoute = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", searchQuerySchema),
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
  .get("/search-private")

export default roomRoute
