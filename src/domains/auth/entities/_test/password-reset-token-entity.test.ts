import { describe, expect, it } from "bun:test"

import { PasswordResetTokenEntity } from "../password-reset-token-entity"

describe("PasswordResetTokenEntity", () => {
  it("should create an instance with the correct properties", () => {
    const entity = new PasswordResetTokenEntity(
      "user@example.com",
      "token123",
      new Date("2025-01-01T00:00:00Z"),
    )

    expect(entity.email).toBe("user@example.com")
    expect(entity.token).toBe("token123")
    expect(entity.expiresAt.toISOString()).toBe("2025-01-01T00:00:00.000Z")
  })

  it("should return true for isExpired if the current date is after expiresAt", () => {
    const entity = new PasswordResetTokenEntity(
      "user@example.com",
      "token123",
      new Date(Date.now() - 1000),
    )
    expect(entity.isExpired).toBe(true)
  })

  it("should return false for isExpired if the current date is before expiresAt", () => {
    const entity = new PasswordResetTokenEntity(
      "user@example.com",
      "token123",
      new Date(Date.now() + 1000),
    )
    expect(entity.isExpired).toBe(false)
  })
})
