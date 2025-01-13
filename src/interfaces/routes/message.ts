import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { CreateChannelMessage } from "@/app/use-cases/messages/create-channel-message"
import { CreateGroupMessage } from "@/app/use-cases/messages/create-group-message"
import { CreatePrivateMessage } from "@/app/use-cases/messages/create-private-message"
import { successResponse } from "@/common/lib/utils"
import { CreateMessageEntity } from "@/domains/messages/entities/create-message-entity"
import { RoomType } from "@/domains/rooms/entities/enums"
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

      const createMessage =
        form.roomType === RoomType.PRIVATE
          ? container.get(CreatePrivateMessage)
          : form.roomType === RoomType.GROUP
            ? container.get(CreateGroupMessage)
            : container.get(CreateChannelMessage)

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
