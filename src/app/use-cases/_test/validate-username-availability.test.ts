import { describe, expect, it, jest } from "bun:test"

import { AuthRepository } from "@/domains/auth/repositories/auth-repository"

import { ValidateUsernameAvailability } from "../validate-username-availability"

const mockAuthRepository: AuthRepository = {
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
  validateUsernameAvailability: jest.fn(),
}

describe("ValidateUsernameAvailability", () => {
  it("should return true if username is available", async () => {
    mockAuthRepository.validateUsernameAvailability = jest
      .fn()
      .mockResolvedValue(true)
    const validator = new ValidateUsernameAvailability(mockAuthRepository)

    const result = await validator.execute("newuser")

    expect(result).toBe(true)
    expect(
      mockAuthRepository.validateUsernameAvailability,
    ).toHaveBeenCalledWith("newuser")
  })

  it("should return false if username is not available", async () => {
    mockAuthRepository.validateUsernameAvailability = jest
      .fn()
      .mockResolvedValue(false)

    const validator = new ValidateUsernameAvailability(mockAuthRepository)

    const result = await validator.execute("existinguser")

    expect(result).toBe(false)
    expect(
      mockAuthRepository.validateUsernameAvailability,
    ).toHaveBeenCalledWith("existinguser")
  })
})
