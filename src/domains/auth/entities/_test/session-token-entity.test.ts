import { describe, expect, it } from "bun:test"

import { SessionTokenEntity } from "../session-token-entity"

describe("SessionTokenEntity", () => {
  it("should create an instance with the correct properties", () => {
    const entity = new SessionTokenEntity(
      "user1",
      "testuser",
      "device1",
      "user@example.com",
    )

    expect(entity.userId).toBe("user1")
    expect(entity.username).toBe("testuser")
    expect(entity.deviceId).toBe("device1")
    expect(entity.email).toBe("user@example.com")
  })
})
