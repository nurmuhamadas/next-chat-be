import { Hono } from "hono"

import { GetPrivateChatOption } from "@/app/use-cases/private-chat/get-private-chat-option"
import { successResponse } from "@/common/lib/utils"
import { container } from "@/infrastuctures/container"

import { sessionMiddleware } from "./middleware/session-middleware"

const privateChatRoute = new Hono()
  .get("/:userId/options", sessionMiddleware, async (c) => {
    const { userId } = c.req.param()

    const session = c.get("userSession")

    const getPrivateChatOption = container.get(GetPrivateChatOption)
    const result = await getPrivateChatOption.execute(session, userId)

    const response: GetPrivateChatOptionResponse = successResponse(
      result.toDTO(),
    )
    return c.json(response)
  })
  .patch("/:userId/options")
  .delete("/:userId/chat")

export default privateChatRoute
