import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { CreateProfile } from "@/app/use-cases/user/create-profile"
import { UpdateProfile } from "@/app/use-cases/user/update-profile"
import { successResponse } from "@/common/lib/utils"
import { CreateProfileEntity } from "@/domains/users/entities/create-profile-entity"
import { UpdateProfileEntity } from "@/domains/users/entities/update-profile-entity"
import { container } from "@/infrastuctures/container"

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
  .get("/")

export default userRoute
