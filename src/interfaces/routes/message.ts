import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { CreateChannelMessage } from "@/app/use-cases/messages/create-channel-message"
import { CreateGroupMessage } from "@/app/use-cases/messages/create-group-message"
import { CreatePrivateMessage } from "@/app/use-cases/messages/create-private-message"
import { DeleteMessageByAdmin } from "@/app/use-cases/messages/delete-message-by-admin"
import { DeleteMessageForAll } from "@/app/use-cases/messages/delete-message-for-all"
import { DeleteMessageForMe } from "@/app/use-cases/messages/delete-message-for-me"
import { GetMessages } from "@/app/use-cases/messages/get-messages"
import { ReadMessage } from "@/app/use-cases/messages/read-message"
import { UpdateMessage } from "@/app/use-cases/messages/update-message"
import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { successCollectionResponse, successResponse } from "@/common/lib/utils"
import { CreateMessageEntity } from "@/domains/messages/entities/create-message-entity"
import { UpdateMessageEntity } from "@/domains/messages/entities/update-message-entity"
import { RoomType } from "@/domains/rooms/entities/enums"
import { container } from "@/infrastuctures/container"

import { searchQuerySchema } from "../schemas/common-schema"
import {
  createMessageSchema,
  getMessageParamSchema,
  updateMessageSchema,
} from "../schemas/message-schema"

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
  .get(
    "/:roomType/:receiverId",
    zValidator("param", getMessageParamSchema),
    zValidator("query", searchQuerySchema),
    sessionMiddleware,
    async (c) => {
      const { receiverId, roomType } = c.req.valid("param")
      const params = c.req.valid("query")

      const session = c.get("userSession")

      const createMessage = container.get(GetMessages)

      const result = await createMessage.execute(
        session,
        receiverId,
        roomType,
        SearchParamsEntity.fromJSON(params),
      )

      const response: GetMessagesResponse = successCollectionResponse(
        result.data.map((v) => v.toDTO()),
        result.total,
        result.cursor,
      )
      return c.json(response)
    },
  )
  .post(
    "/:roomType/:receiverId/read",
    zValidator("param", getMessageParamSchema),
    sessionMiddleware,
    async (c) => {
      const { receiverId } = c.req.valid("param")

      const session = c.get("userSession")

      const readMessage = container.get(ReadMessage)
      await readMessage.execute(session, receiverId)

      const response: MarkMessageAsReadResponse = successResponse(true)
      return c.json(response)
    },
  )
  .put(
    "/:messageId",
    sessionMiddleware,
    zValidator("json", updateMessageSchema),
    async (c) => {
      const { messageId } = c.req.param()
      const data = c.req.valid("json")

      const session = c.get("userSession")

      const updateMessage = container.get(UpdateMessage)

      const result = await updateMessage.execute(
        session,
        messageId,
        UpdateMessageEntity.fromJSON(data),
      )

      const response: UpdateMessageResponse = successResponse(result.toDTO())
      return c.json(response)
    },
  )
  .delete("/:messageId/me", sessionMiddleware, async (c) => {
    const { messageId } = c.req.param()

    const session = c.get("userSession")

    const deleteMessage = container.get(DeleteMessageForMe)

    await deleteMessage.execute(session, messageId)

    const response: DeleteMessageResponse = successResponse({
      id: messageId,
    })
    return c.json(response)
  })
  .delete("/:messageId/all", sessionMiddleware, async (c) => {
    const { messageId } = c.req.param()

    const session = c.get("userSession")

    const deleteMessage = container.get(DeleteMessageForAll)

    await deleteMessage.execute(session, messageId)

    const response: DeleteMessageResponse = successResponse({
      id: messageId,
    })
    return c.json(response)
  })
  .delete("/:messageId/admin", sessionMiddleware, async (c) => {
    const { messageId } = c.req.param()

    const session = c.get("userSession")

    const deleteMessage = container.get(DeleteMessageByAdmin)

    await deleteMessage.execute(session, messageId)

    const response: DeleteMessageResponse = successResponse({
      id: messageId,
    })
    return c.json(response)
  })

export default messageRoute
