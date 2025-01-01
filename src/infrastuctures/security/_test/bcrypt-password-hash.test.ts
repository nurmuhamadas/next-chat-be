import { describe, expect, it } from "bun:test"

import { BcryptPasswordHash } from "../bcrypt-password-hash"

describe("BcryptPasswordHash", () => {
  it("should hash a password correctly", async () => {
    const bcryptPasswordHash = new BcryptPasswordHash()
    const password = "securepassword"

    const hashedPassword = await bcryptPasswordHash.hash(password)

    expect(typeof hashedPassword).toBe("string")
    expect(hashedPassword).not.toBe(password)
  })

  it("should compare a password with its hash correctly", async () => {
    const bcryptPasswordHash = new BcryptPasswordHash()
    const password = "securepassword"
    const hashedPassword = await bcryptPasswordHash.hash(password)

    const isMatch = await bcryptPasswordHash.comparePassword(
      password,
      hashedPassword,
    )

    expect(isMatch).toBe(true)

    const isNotMatch = await bcryptPasswordHash.comparePassword(
      "wrongpassword",
      hashedPassword,
    )

    expect(isNotMatch).toBe(false)
  })
})
