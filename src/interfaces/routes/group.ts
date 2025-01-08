import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { AddGroupAdmin } from "@/app/use-cases/groups/add-group-admin"
import { AddGroupMember } from "@/app/use-cases/groups/add-group-member"
import { CreateGroup } from "@/app/use-cases/groups/create-group"
import { DeleteGroup } from "@/app/use-cases/groups/delete-group"
import { DeleteGroupMember } from "@/app/use-cases/groups/delete-group-member"
import { GetGroupById } from "@/app/use-cases/groups/get-group-by-id"
import { GetGroupMembers } from "@/app/use-cases/groups/get-group-members"
import { GetJoinedGroups } from "@/app/use-cases/groups/get-joined-groups"
import { GetNameAvailability } from "@/app/use-cases/groups/get-name-availability"
import { JoinGroup } from "@/app/use-cases/groups/join-group"
import { RemoveGroupAdmin } from "@/app/use-cases/groups/remove-group-admin"
import { SearchPublicGroups } from "@/app/use-cases/groups/search-public-groups"
import { UpdateGroup } from "@/app/use-cases/groups/update-group"
import { SearchParamsEntity } from "@/common/entities/search-params-entity"
import { successCollectionResponse, successResponse } from "@/common/lib/utils"
import { CreateGroupEntity } from "@/domains/groups/entities/create-group-entity"
import { UpdateGroupEntity } from "@/domains/groups/entities/update-group-entity"
import { container } from "@/infrastuctures/container"

import { searchQuerySchema } from "../schemas/common-schema"
import { groupSchema, joinGroupSchema } from "../schemas/group-schema"

import { sessionMiddleware } from "./middleware/session-middleware"

const groupRoute = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", searchQuerySchema),
    async (c) => {
      const params = c.req.valid("query")
      const session = c.get("userSession")

      const getGroups = container.get(GetJoinedGroups)
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
        ...data,
        memberIds: Array.isArray(memberIds) ? memberIds : [memberIds],
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
  .get("/:groupId", sessionMiddleware, async (c) => {
    const { groupId } = c.req.param()

    const session = c.get("userSession")

    const getGroupById = container.get(GetGroupById)
    const result = await getGroupById.execute(session, groupId)

    const response: GetGroupResponse = successResponse(result.toDTO())
    return c.json(response)
  })
  .patch(
    "/:groupId",
    sessionMiddleware,
    zValidator("form", groupSchema.partial()),
    async (c) => {
      const { groupId } = c.req.param()
      const { image, ...form } = c.req.valid("form")
      const imageFile = image as unknown as File

      const session = c.get("userSession")

      const updateGroup = container.get(UpdateGroup)
      const result = await updateGroup.execute(
        session,
        UpdateGroupEntity.fromJSON({
          ...form,
          id: groupId,
        }),
        imageFile,
      )

      const response: GetGroupResponse = successResponse(result.toDTO())
      return c.json(response)
    },
  )
  .delete("/:groupId", sessionMiddleware, async (c) => {
    const { groupId } = c.req.param()
    const session = c.get("userSession")

    const deleteGroup = container.get(DeleteGroup)
    await deleteGroup.execute(session, groupId)

    const response: DeleteGroupResponse = successResponse({ id: groupId })
    return c.json(response)
  })
  .get(
    "/:groupId/members",
    zValidator("query", searchQuerySchema),
    sessionMiddleware,
    async (c) => {
      const { groupId } = c.req.param()
      const query = c.req.valid("query")

      const session = c.get("userSession")

      const getGroupMembers = container.get(GetGroupMembers)
      const result = await getGroupMembers.execute(
        session,
        groupId,
        SearchParamsEntity.fromJSON(query),
      )

      const response: GetGroupMembersResponse = successCollectionResponse(
        result.data.map((v) => v.toDTO()),
        result.total,
        result.cursor,
      )
      return c.json(response)
    },
  )
  .post("/:groupId/members/:userId", sessionMiddleware, async (c) => {
    const { groupId, userId: addedUserId } = c.req.param()

    const session = c.get("userSession")

    const addGroupMember = container.get(AddGroupMember)
    await addGroupMember.execute(session, groupId, addedUserId)

    const response: AddGroupMemberResponse = successResponse(true)
    return c.json(response)
  })
  .delete("/:groupId/members/:userId", sessionMiddleware, async (c) => {
    const { groupId, userId: removedUserId } = c.req.param()

    const session = c.get("userSession")

    const deleteGroupMember = container.get(DeleteGroupMember)
    await deleteGroupMember.execute(session, groupId, removedUserId)

    const response: DeleteGroupMemberResponse = successResponse(true)
    return c.json(response)
  })
  .post("/:groupId/members/:userId/admin", sessionMiddleware, async (c) => {
    const { groupId, userId: addedAdminId } = c.req.param()

    const session = c.get("userSession")

    const addGroupAdmin = container.get(AddGroupAdmin)
    await addGroupAdmin.execute(session, groupId, addedAdminId)

    const response: SetAdminGroupResponse = successResponse(true)
    return c.json(response)
  })
  .delete("/:groupId/members/:userId/admin", sessionMiddleware, async (c) => {
    const { groupId, userId: removedAdminId } = c.req.param()

    const session = c.get("userSession")

    const removeGroupAdmin = container.get(RemoveGroupAdmin)
    await removeGroupAdmin.execute(session, groupId, removedAdminId)

    const response: UnsetAdminGroupResponse = successResponse(true)
    return c.json(response)
  })
  .post(
    "/:groupId/join",
    sessionMiddleware,
    zValidator("json", joinGroupSchema),
    async (c) => {
      const { code } = c.req.valid("json")
      const { groupId } = c.req.param()

      const session = c.get("userSession")

      const joinGroup = container.get(JoinGroup)
      await joinGroup.execute(session, groupId, code)

      const response: JoinGroupResponse = successResponse(true)
      return c.json(response)
    },
  )

export default groupRoute
