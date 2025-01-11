import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { CreateChannel } from "@/app/use-cases/channels/create-channel"
import { GetChannelNameAvailability } from "@/app/use-cases/channels/get-channel-name-availability"
import { GetSubscribedChannels } from "@/app/use-cases/channels/get-subscribed-channels"
import { SearchPublicChannels } from "@/app/use-cases/channels/search-public-channels"
import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { successCollectionResponse, successResponse } from "@/common/lib/utils"
import { CreateChannelEntity } from "@/domains/channels/entities/create-channel-entity"
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

export default channelRoute
