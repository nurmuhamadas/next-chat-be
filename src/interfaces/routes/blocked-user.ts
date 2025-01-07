import { Hono } from "hono"

import { BlockUser } from "@/app/use-cases/blocked-user/block-user"
import { GetBlockedUsers } from "@/app/use-cases/blocked-user/get-blocked-users"
import { GetIsUserBlocked } from "@/app/use-cases/blocked-user/get-is-user-blocked"
import {
  successCollectionResponse,
  successResponse,
  zValidator,
} from "@/common/lib/utils"
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
  .get("/:blockedUserId/is-blocked", sessionMiddleware, async (c) => {
    const { blockedUserId } = c.req.param()
    const session = c.get("userSession")

    const getIsUserBlocked = container.get(GetIsUserBlocked)
    const result = await getIsUserBlocked.execute(session, blockedUserId)

    const response: GetIsBlockedUserResponse = successResponse(result)
    return c.json(response)
  })
  .post("/:blockedUserId", sessionMiddleware, async (c) => {
    const { blockedUserId } = c.req.param()
    const session = c.get("userSession")

    const blockUser = container.get(BlockUser)
    await blockUser.execute(session, blockedUserId)

    const response: BlockUserResponse = successResponse({ id: blockedUserId })
    return c.json(response)
  })

export default blockedUserRoute
