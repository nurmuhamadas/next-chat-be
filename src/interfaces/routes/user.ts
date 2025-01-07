import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { CreateProfile } from "@/app/use-cases/user/create-profile"
import { SearchUsers } from "@/app/use-cases/user/search-users"
import { SearchUsersForMember } from "@/app/use-cases/user/search-users-for-member"
import { UpdateProfile } from "@/app/use-cases/user/update-profile"
import { successCollectionResponse, successResponse } from "@/common/lib/utils"
import { CreateProfileEntity } from "@/domains/users/entities/create-profile-entity"
import { UpdateProfileEntity } from "@/domains/users/entities/update-profile-entity"
import { container } from "@/infrastuctures/container"

import { searchQuerySchema } from "../schemas/common-schema"
import { profileSchema } from "../schemas/profile-schema"

import { sessionMiddleware } from "./middleware/session-middleware"

const userRoute = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", profileSchema),
    async (c) => {
      const userAgent = c.req.header("User-Agent") ?? "Unknown"
      const session = c.get("userSession")

      const { image, gender, name, bio } = c.req.valid("form")
      const imageFile = image as unknown as File

      const profileEntity = new CreateProfileEntity(
        session.userId,
        name,
        gender,
        bio,
      )
      const createProfile = container.get(CreateProfile)
      const profile = await createProfile.execute(c, {
        entity: profileEntity,
        imageFile,
        session,
        userAgent,
      })

      const response: CreateUserProfileResponse = successResponse({
        id: profile.id,
        userId: profile.userId,
        name: profile.name,
        gender: profile.gender,
        bio: profile.bio ?? null,
        imageUrl: profile.imageUrl ?? null,
        email: session.email,
        username: session.username,
        lastSeenAt: profile.lastSeenAt
          ? profile.lastSeenAt.toISOString()
          : null,
      })
      return c.json(response)
    },
  )
  .patch(
    "/",
    sessionMiddleware,
    zValidator("form", profileSchema.partial()),
    async (c) => {
      const { image, gender, name, bio } = c.req.valid("form")
      const imageFile = image as unknown as File

      const session = c.get("userSession")

      const profileEntity = new UpdateProfileEntity(name, gender, bio)

      const updateProfile = container.get(UpdateProfile)
      const profile = await updateProfile.execute({
        entity: profileEntity,
        imageFile,
        session,
      })

      const response: CreateUserProfileResponse = successResponse({
        id: profile.id,
        userId: profile.userId,
        name: profile.name,
        gender: profile.gender,
        bio: profile.bio ?? null,
        imageUrl: profile.imageUrl ?? null,
        email: session.email,
        username: session.username,
        lastSeenAt: profile.lastSeenAt
          ? profile.lastSeenAt.toISOString()
          : null,
      })
      return c.json(response)
    },
  )
  .get(
    "/search",
    sessionMiddleware,
    zValidator("query", searchQuerySchema),
    async (c) => {
      const { query, limit, cursor } = c.req.valid("query")

      const session = c.get("userSession")

      const searchUsers = container.get(SearchUsers)
      const result = await searchUsers.execute({
        userId: session.userId,
        query,
        limit,
        cursor,
      })

      const response: SearchUsersResponse = successCollectionResponse(
        result.data.map((v) => ({
          id: v.id,
          name: v.name,
          lastSeenAt: v.lastSeenAt ? v.lastSeenAt.toISOString() : null,
          imageUrl: v.imageUrl ?? null,
        })),
        result.total,
        result.cursor,
      )
      return c.json(response)
    },
  )
  .get(
    "/search-for-member/:groupId",
    sessionMiddleware,
    zValidator("query", searchQuerySchema),
    async (c) => {
      const { query, limit, cursor } = c.req.valid("query")
      const { groupId } = c.req.param()

      const session = c.get("userSession")

      const searchUsers = container.get(SearchUsersForMember)
      const result = await searchUsers.execute({
        userId: session.userId,
        groupId,
        query,
        limit,
        cursor,
      })

      const response: SearchUsersForMemberResponse = successCollectionResponse(
        result.data.map((v) => ({
          id: v.id,
          name: v.name,
          lastSeenAt: v.lastSeenAt ? v.lastSeenAt.toISOString() : null,
          imageUrl: v.imageUrl ?? null,
          allowAddToGroup: v.allowAddToGroup,
        })),
        result.total,
        result.cursor,
      )
      return c.json(response)
    },
  )

export default userRoute
