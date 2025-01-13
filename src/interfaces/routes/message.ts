import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { CreatePrivateMessage } from "@/app/use-cases/messages/create-private-message"
import { successResponse } from "@/common/lib/utils"
import { CreateMessageEntity } from "@/domains/messages/entities/create-message-entity"
import { container } from "@/infrastuctures/container"

import { createMessageSchema } from "../schemas/message-schema"

import { sessionMiddleware } from "./middleware/session-middleware"

const messageRoute = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createMessageSchema),
    async (c) => {
      const { attachments, ...form } = c.req.valid("form")

      const session = c.get("userSession")

      const createMessage = container.get(CreatePrivateMessage)
      const result = await createMessage.execute(
        session,
        CreateMessageEntity.fromJSON({
          ...form,
          isEmojiOnly: form.isEmojiOnly ?? false,
        }),
        attachments,
      )

      const response: CreateMessageResponse = successResponse(result.toDTO())
      return c.json(response)
    },
  )
  .get("/")

export default messageRoute
