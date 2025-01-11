import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { AddChannelAdmin } from "@/app/use-cases/channels/add-channel-admin"
import { CreateChannel } from "@/app/use-cases/channels/create-channel"
import { DeleteChannel } from "@/app/use-cases/channels/delete-channel"
import { GetChannelById } from "@/app/use-cases/channels/get-channel-by-id"
import { GetChannelNameAvailability } from "@/app/use-cases/channels/get-channel-name-availability"
import { GetChannelSubscribers } from "@/app/use-cases/channels/get-group-subscribers"
import { GetSubscribedChannels } from "@/app/use-cases/channels/get-subscribed-channels"
import { SearchPublicChannels } from "@/app/use-cases/channels/search-public-channels"
import { UpdateChannel } from "@/app/use-cases/channels/update-channel"
import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { successCollectionResponse, successResponse } from "@/common/lib/utils"
import { CreateChannelEntity } from "@/domains/channels/entities/create-channel-entity"
import { UpdateChannelEntity } from "@/domains/channels/entities/update-channel-entity"
import { container } from "@/infrastuctures/container"

import { channelSchema } from "../schemas/channel-schema"
import { searchQuerySchema } from "../schemas/common-schema"

import { sessionMiddleware } from "./middleware/session-middleware"

const channelRoute = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", searchQuerySchema),
    async (c) => {
      const params = c.req.valid("query")
      const session = c.get("userSession")

      const getGroups = container.get(GetSubscribedChannels)
      const result = await getGroups.execute(
        session,
        SearchParamsEntity.fromJSON(params),
      )

      const response: GetChannelsResponse = successCollectionResponse(
        result.data.map((v) => v.toDTO()),
        result.total,
        result.cursor,
      )
      return c.json(response)
    },
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", channelSchema),
    async (c) => {
      const { image, ...data } = c.req.valid("form")
      const imageFile = image as unknown as File

      const session = c.get("userSession")

      const createChannel = container.get(CreateChannel)
      const result = await createChannel.execute(
        session,
        CreateChannelEntity.fromJSON({
          ...data,
          ownerId: session.userId,
        }),
        imageFile,
      )

      const response: CreateChannelResponse = successResponse(result.toDTO())
      return c.json(response)
    },
  )
  .get("/name-availability/:channelName", sessionMiddleware, async (c) => {
    const { channelName } = c.req.param()

    const session = c.get("userSession")

    const getChannelNameAvailability = container.get(GetChannelNameAvailability)
    const isAvailable = await getChannelNameAvailability.execute(
      session,
      channelName,
    )

    const resposne: GetNameAvailabilityResponse = successResponse(isAvailable)
    return c.json(resposne)
  })
  .get(
    "/search",
    sessionMiddleware,
    zValidator("query", searchQuerySchema),
    async (c) => {
      const query = c.req.valid("query")

      const session = c.get("userSession")

      const searchPublicChannels = container.get(SearchPublicChannels)
      const result = await searchPublicChannels.execute(
        session,
        SearchParamsEntity.fromJSON(query),
      )
      const response: SearchChannelsResponse = successCollectionResponse(
        result.data.map((v) => v.toDTO()),
        result.total,
        result.cursor,
      )
      return c.json(response)
    },
  )
  .get("/:channelId", sessionMiddleware, async (c) => {
    const { channelId } = c.req.param()
    const session = c.get("userSession")

    const getChannelById = container.get(GetChannelById)
    const result = await getChannelById.execute(session, channelId)

    const response: GetChannelResponse = successResponse(result.toDTO())
    return c.json(response)
  })
  .patch(
    "/:channelId",
    sessionMiddleware,
    zValidator("form", channelSchema.partial()),
    async (c) => {
      const { channelId } = c.req.param()
      const { image, ...form } = c.req.valid("form")
      const imageFile = image as unknown as File

      const session = c.get("userSession")

      const updateChannel = container.get(UpdateChannel)
      const result = await updateChannel.execute(
        session,
        UpdateChannelEntity.fromJSON({
          ...form,
          id: channelId,
        }),
        imageFile,
      )

      const response: PatchChannelResponse = successResponse(result.toDTO())
      return c.json(response)
    },
  )
  .delete("/:channelId", sessionMiddleware, async (c) => {
    const { channelId } = c.req.param()
    const session = c.get("userSession")

    const deleteChannel = container.get(DeleteChannel)
    await deleteChannel.execute(session, channelId)

    const response: DeleteChannelResponse = successResponse({ id: channelId })
    return c.json(response)
  })
  .get(
    "/:channelId/subscribers",
    zValidator("query", searchQuerySchema),
    sessionMiddleware,
    async (c) => {
      const { channelId } = c.req.param()
      const query = c.req.valid("query")

      const session = c.get("userSession")

      const getGroupSubscribers = container.get(GetChannelSubscribers)
      const result = await getGroupSubscribers.execute(
        session,
        channelId,
        SearchParamsEntity.fromJSON(query),
      )

      const response: GetChannelSubscribersResponse = successCollectionResponse(
        result.data.map((v) => v.toDTO()),
        result.total,
        result.cursor,
      )
      return c.json(response)
    },
  )
  .post(
    "/:channelId/subscribers/:userId/admin",
    sessionMiddleware,
    async (c) => {
      const { channelId, userId: addedAdminId } = c.req.param()

      const session = c.get("userSession")

      const addChannelAdmin = container.get(AddChannelAdmin)
      await addChannelAdmin.execute(session, channelId, addedAdminId)

      const response: SetAdminChannelResponse = successResponse(true)
      return c.json(response)
    },
  )

export default channelRoute
