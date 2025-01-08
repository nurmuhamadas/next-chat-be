import { Hono } from "hono"

import { ClearChat } from "@/app/use-cases/private-chat/clear-chat"
import { GetPrivateChatOption } from "@/app/use-cases/private-chat/get-private-chat-option"
import { UpdatePrivateChatOption } from "@/app/use-cases/private-chat/update-private-chat-option"
import { successResponse, zValidator } from "@/common/lib/utils"
import { UpdatePrivateChatOptionEntity } from "@/domains/private-chat/entites/update-private-chat-option-entity"
import { container } from "@/infrastuctures/container"

import { updatePrivateChatOptionSchema } from "../schemas/private-chat-schema"

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
  .patch(
    "/:userId/options",
    sessionMiddleware,
    zValidator("json", updatePrivateChatOptionSchema),
    async (c) => {
      const { userId } = c.req.param()
      const { notification } = c.req.valid("json")

      const session = c.get("userSession")

      const updatePrivateChatOption = container.get(UpdatePrivateChatOption)
      const result = await updatePrivateChatOption.execute(
        session,
        UpdatePrivateChatOptionEntity.fromJSON({
          userId,
          notification,
        }),
      )

      const response: UpdatePrivateChatOptionResponse = successResponse(
        result.toDTO(),
      )
      return c.json(response)
    },
  )
  .delete("/:userId/chat", sessionMiddleware, async (c) => {
    const { userId } = c.req.param()

    const session = c.get("userSession")

    const clearChat = container.get(ClearChat)
    await clearChat.execute(session, userId)

    const response: DeleteAllPrivateChatResponse = successResponse(true)
    return c.json(response)
  })

export default privateChatRoute
