import { describe, expect, it } from "bun:test"

import { UserEntity } from "../user-entity"

describe("UserEntity", () => {
  it("should create an instance with the correct properties", () => {
    const user = new UserEntity(
      "1",
      "testuser",
      "test@example.com",
      "securepassword",
      null,
    )

    expect(user.id).toBe("1")
    expect(user.username).toBe("testuser")
    expect(user.email).toBe("test@example.com")
    expect(user.password).toBe("securepassword")
    expect(user.emailVerifiedAt).toBeNull()
  })

  it("should return true for isVerified if emailVerifiedAt is set", () => {
    const user = new UserEntity(
      "2",
      "verifieduser",
      "verified@example.com",
      "securepassword",
      new Date(),
    )

    expect(user.isVerified).toBe(true)
  })

  it("should return false for isVerified if emailVerifiedAt is null", () => {
    const user = new UserEntity(
      "3",
      "unverifieduser",
      "unverified@example.com",
      "securepassword",
      null,
    )

    expect(user.isVerified).toBe(false)
  })

  it("should allow updating the username", () => {
    const user = new UserEntity(
      "4",
      "oldusername",
      "user@example.com",
      "securepassword",
      null,
    )

    user.username = "newusername"
    expect(user.username).toBe("newusername")
  })

  it("should allow updating the email", () => {
    const user = new UserEntity(
      "5",
      "user",
      "oldemail@example.com",
      "securepassword",
      null,
    )

    user.email = "newemail@example.com"
    expect(user.email).toBe("newemail@example.com")
  })
})
