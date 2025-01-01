import { beforeAll, describe, expect, it, spyOn } from "bun:test"
import * as jwt from "hono/jwt"

import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"

import { JWTTokenManager } from "../jwt-token-manager"

describe("JWTTokenManager", () => {
  const AUTH_SECRET = "test_secret"
  let jwtTokenManager: JWTTokenManager

  beforeAll(() => {
    process.env.AUTH_SECRET = AUTH_SECRET
    jwtTokenManager = new JWTTokenManager()
  })

  it("should generate a session token correctly", async () => {
    const spySign = spyOn(jwt, "sign")
    const session = new SessionTokenEntity(
      "user1",
      "username",
      "device1",
      "user@example.com",
    )

    const token = await jwtTokenManager.generateSessionToken(session)

    expect(typeof token).toBe("string")
    expect(spySign).toBeCalled()
  })

  it("should generate a verification token correctly", async () => {
    const email = "user@example.com"
    const username = "username"
    const spySign = spyOn(jwt, "sign")

    const token = await jwtTokenManager.generateVerificationToken(
      email,
      username,
    )

    expect(typeof token).toBe("string")
    expect(spySign).toHaveBeenCalled()
  })

  it("should verify a session token correctly", async () => {
    const session = new SessionTokenEntity(
      "user1",
      "username",
      "device1",
      "user@example.com",
    )
    const token = await jwtTokenManager.generateSessionToken(session)

    const verifiedSession = await jwtTokenManager.verifySessionToken(token)

    expect(verifiedSession).toBeInstanceOf(SessionTokenEntity)
    expect(verifiedSession.userId).toBe("user1")
    expect(verifiedSession.username).toBe("username")
    expect(verifiedSession.deviceId).toBe("device1")
    expect(verifiedSession.email).toBe("user@example.com")
  })
})
