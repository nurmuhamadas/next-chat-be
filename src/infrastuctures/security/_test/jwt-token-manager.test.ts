import { beforeAll, describe, expect, it, spyOn } from "bun:test"
import * as jwt from "hono/jwt"

import { DateHelper } from "@/common/lib/date-helper"
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

  it("should calculate token expiration date correctly", () => {
    spyOn(DateHelper, "addDateDays").mockReturnValue(
      new Date("2025-02-01T00:00:00Z"),
    )

    const expirationDate = jwtTokenManager.getTokenExpired()

    expect(DateHelper.addDateDays).toHaveBeenCalledWith(expect.any(Date), 30)
    expect(expirationDate.toISOString()).toBe("2025-02-01T00:00:00.000Z")
  })
})
