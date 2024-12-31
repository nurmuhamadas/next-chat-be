import { beforeEach, describe, expect, it, jest } from "bun:test"

import { SessionEntity } from "../session-entity"

describe("SessionEntity", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should create an instance with the correct properties", () => {
    const session = new SessionEntity(
      "1",
      "sample-token",
      "device-123",
      "Mozilla/5.0",
      "user@example.com",
      new Date("2025-01-01T00:00:00Z"),
    )

    expect(session.id).toBe("1")
    expect(session.token).toBe("sample-token")
    expect(session.deviceId).toBe("device-123")
    expect(session.userAgent).toBe("Mozilla/5.0")
    expect(session.email).toBe("user@example.com")
    expect(session.expiresAt.toISOString()).toBe("2025-01-01T00:00:00.000Z")
  })

  it("should return true for isExpired if the current date is after expiresAt", async () => {
    const session = new SessionEntity(
      "2",
      "sample-token",
      "device-456",
      "Mozilla/5.0",
      "user@example.com",
      new Date("2024-01-01T00:00:00Z"),
    )

    expect(session.isExpired).toBe(true)
  })

  it("should return false for isExpired if the current date is before expiresAt", () => {
    const session = new SessionEntity(
      "3",
      "sample-token",
      "device-789",
      "Mozilla/5.0",
      "user@example.com",
      new Date(Date.now() + 1000000),
    )

    expect(session.isExpired).toBe(false)
  })
})
