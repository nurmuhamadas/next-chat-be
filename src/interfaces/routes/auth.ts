import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { SignIn } from "@/app/use-cases/auth/sign-in"
import { SignUp } from "@/app/use-cases/auth/sign-up"
import { ValidateUsernameAvailability } from "@/app/use-cases/auth/validate-username-availability"
import { successResponse } from "@/common/lib/utils"
import { container } from "@/infrastuctures/container"

import { signInSchema, signUpSchema } from "../schemas/auth-schema"

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
  .post("/sign-in", zValidator("json", signInSchema), async (c) => {
    const { email, password } = c.req.valid("json")
    const userAgent = c.req.header("User-Agent") ?? "Unknown"

    const signIn = container.get(SignIn)

    const status = await signIn.execute(
      c,
      {
        email,
        password,
      },
      userAgent,
    )

    const response: SignInResponse = successResponse({
      status,
    })
    return c.json(response)
  })

export default authRoute
