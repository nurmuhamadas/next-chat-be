import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { CreateGroup } from "@/app/use-cases/groups/create-group"
import { GetGroups } from "@/app/use-cases/groups/get-groups"
import { GetNameAvailability } from "@/app/use-cases/groups/get-name-availability"
import { SearchPublicGroups } from "@/app/use-cases/groups/search-public-groups"
import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { successCollectionResponse, successResponse } from "@/common/lib/utils"
import { CreateGroupEntity } from "@/domains/groups/entities/create-group-entity"
import { container } from "@/infrastuctures/container"

import { searchQuerySchema } from "../schemas/common-schema"
import { groupSchema } from "../schemas/group-schema"

import { sessionMiddleware } from "./middleware/session-middleware"

const groupRoute = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", searchQuerySchema),
    async (c) => {
      const params = c.req.valid("query")
      const session = c.get("userSession")

      const getGroups = container.get(GetGroups)
      const result = await getGroups.execute(
        session,
        SearchParamsEntity.fromJSON(params),
      )

      const response: GetGroupsResponse = successCollectionResponse(
        result.data.map((v) => v.toDTO()),
        result.total,
        result.cursor,
      )
      return c.json(response)
    },
  )
  .post("/", sessionMiddleware, zValidator("form", groupSchema), async (c) => {
    const { image, memberIds, ...data } = c.req.valid("form")
    const imageFile = image as unknown as File

    const session = c.get("userSession")

    const createGroup = container.get(CreateGroup)
    const result = await createGroup.execute(
      session,
      CreateGroupEntity.fromJSON({
        name: data.name,
        type: data.type,
        memberIds,
        ownerId: session.userId,
      }),
      imageFile,
    )

    const response: CreateGroupResponse = successResponse(result.toDTO())
    return c.json(response)
  })
  .get("/name-availability/:groupName", sessionMiddleware, async (c) => {
    const { groupName } = c.req.param()
    const session = c.get("userSession")

    const getNameAvailability = container.get(GetNameAvailability)
    const isAvailable = await getNameAvailability.execute(session, groupName)

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

      const searchPublicGroups = container.get(SearchPublicGroups)
      const result = await searchPublicGroups.execute(
        session,
        SearchParamsEntity.fromJSON(query),
      )
      const response: SearchGroupsResponse = successCollectionResponse(
        result.data.map((v) => v.toDTO()),
        result.total,
        result.cursor,
      )
      return c.json(response)
    },
  )

export default groupRoute
