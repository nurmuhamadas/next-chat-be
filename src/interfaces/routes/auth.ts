import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { SignUp } from "@/app/use-cases/sign-up"
import { ValidateUsernameAvailability } from "@/app/use-cases/validate-username-availability"
import { successResponse } from "@/common/lib/utils"
import { AuthRepositoryImpl } from "@/infrastuctures/repositories/auth-repository-impl"
import { BcryptPasswordHash } from "@/infrastuctures/security/bcrypt-password-hash"
import { JWTTokenManager } from "@/infrastuctures/security/jwt-token-manager"

import { signUpSchema } from "../schemas/auth-schema"

const authRoute = new Hono()
  .get("/username-availability/:username", async (c) => {
    const { username } = c.req.param()

    const authRepo = new AuthRepositoryImpl()
    const validateUsername = new ValidateUsernameAvailability(authRepo)
    const isUsernameAvailable = await validateUsername.execute(username)

    const response: UsernameAvailabilityResponse =
      successResponse(isUsernameAvailable)
    return c.json(response)
  })
  .post("/sign-up", zValidator("json", signUpSchema), async (c) => {
    const { username, email, password } = c.req.valid("json")

    const authRepo = new AuthRepositoryImpl()
    const passwordHash = new BcryptPasswordHash()
    const tokenManager = new JWTTokenManager()
    const signUp = new SignUp(authRepo, passwordHash, tokenManager)

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
