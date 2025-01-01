import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { SignUp } from "@/app/use-cases/sign-up"
import { ValidateUsernameAvailability } from "@/app/use-cases/validate-username-availability"
import { successResponse } from "@/common/lib/utils"
import { container } from "@/infrastuctures/container"

import { signUpSchema } from "../schemas/auth-schema"

const authRoute = new Hono()
  .get("/username-availability/:username", async (c) => {
    const { username } = c.req.param()

    const validateUsername = container.get(ValidateUsernameAvailability)

    const isUsernameAvailable = await validateUsername.execute(username)

    const response: UsernameAvailabilityResponse =
      successResponse(isUsernameAvailable)
    return c.json(response)
  })
  .post("/sign-up", zValidator("json", signUpSchema), async (c) => {
    const { username, email, password } = c.req.valid("json")

    const signUp = container.get(SignUp)

    const createdUser = await signUp.execute({
      username,
      email,
      password,
    })

    const response: SignUpResponse = successResponse({
      username: createdUser.username,
      email: createdUser.email,
    })
    return c.json(response)
  })

export default authRoute
