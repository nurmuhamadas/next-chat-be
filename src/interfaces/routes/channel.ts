import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { GetSubscribedChannels } from "@/app/use-cases/channels/get-subscribed-channels"
import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { successCollectionResponse } from "@/common/lib/utils"
import { container } from "@/infrastuctures/container"

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
  .post("/")

export default channelRoute
