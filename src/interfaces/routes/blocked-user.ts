import { Hono } from "hono"

import { GetBlockedUsers } from "@/app/use-cases/blocked-user/get-blocked-users"
import { successCollectionResponse, zValidator } from "@/common/lib/utils"
import { container } from "@/infrastuctures/container"

import { searchQuerySchema } from "../schemas/common-schema"

import { sessionMiddleware } from "./middleware/session-middleware"

const blockedUserRoute = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", searchQuerySchema),
    async (c) => {
      const { limit, cursor } = c.req.valid("query")
      const session = c.get("userSession")

      const getBlockedUsers = container.get(GetBlockedUsers)
      const result = await getBlockedUsers.execute(session, {
        limit,
        cursor,
      })

      const response: GetBlockedUsersResponse = successCollectionResponse(
        result.data.map((v) => v.toDTO()),
        result.total,
        result.cursor,
      )

      return c.json(response)
    },
  )
  .get("/:blockedUserId/is-blocked")

export default blockedUserRoute
