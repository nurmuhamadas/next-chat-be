import { beforeEach, describe, expect, it, jest } from "bun:test"

import { AuthTokenManager } from "@/app/security/auth-token-manager"
import { PasswordHash } from "@/app/security/password-hash"
import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import { UserEntity } from "@/domains/auth/entities/user-entity"
import { AuthRepository } from "@/domains/auth/repositories/auth-repository"

import { SignUp } from "../auth/sign-up"

const mockAuthRepository: AuthRepository = {
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
  validateUsernameAvailability: jest.fn(),
}
const mockPasswordHash: PasswordHash = {
  comparePassword: jest.fn(),
  hash: jest.fn(),
}
const mockTokenManager: AuthTokenManager = {
  generateSessionToken: jest.fn(),
  verifySessionToken: jest.fn(),
  generateVerificationToken: jest.fn(),
  getTokenExpired: jest.fn(),
}

describe("SignUp", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should create a new user if username and email are available", async () => {
    mockAuthRepository.validateUsernameAvailability = jest
      .fn()
      .mockResolvedValue(true)
    mockAuthRepository.getUserByEmail = jest.fn().mockResolvedValue(null)
    mockAuthRepository.createUser = jest.fn().mockResolvedValue({
      id: "1",
      username: "newuser",
      email: "user@example.com",
      password: "hashedpassword",
      emailVerifiedAt: null,
    })

    mockPasswordHash.hash = jest.fn().mockResolvedValue("hashedpassword")
    mockTokenManager.generateVerificationToken = jest
      .fn()
      .mockResolvedValue("verificationtoken")

    const expiresAt = new Date()
    mockTokenManager.getTokenExpired = jest.fn().mockResolvedValue(expiresAt)

    const signUp = new SignUp(
      mockAuthRepository,
      mockPasswordHash,
      mockTokenManager,
    )
    const user = new UserEntity(
      "0",
      "newuser",
      "user@example.com",
      "password123",
      null,
    )

    const result = await signUp.execute(user)

    expect(result).toBeInstanceOf(UserEntity)
    expect(result.username).toBe("newuser")
    expect(
      mockAuthRepository.validateUsernameAvailability,
    ).toHaveBeenCalledWith("newuser")
    expect(mockAuthRepository.getUserByEmail).toHaveBeenCalledWith(
      "user@example.com",
    )
    expect(mockPasswordHash.hash).toHaveBeenCalledWith("password123")
    expect(mockTokenManager.generateVerificationToken).toHaveBeenCalledWith(
      "user@example.com",
      "newuser",
    )
    expect(mockAuthRepository.createUser).toHaveBeenCalledWith(
      "newuser",
      "user@example.com",
      "hashedpassword",
      "verificationtoken",
      expiresAt,
    )
  })

  it("should throw an error if the username is already taken", async () => {
    mockAuthRepository.validateUsernameAvailability = jest
      .fn()
      .mockResolvedValue(false)

    const signUp = new SignUp(
      mockAuthRepository,
      mockPasswordHash,
      mockTokenManager,
    )
    const user = new UserEntity(
      "0",
      "existinguser",
      "user@example.com",
      "password123",
      null,
    )

    await expect(signUp.execute(user)).rejects.toThrowError(
      new InvariantError(ERROR.USERNAME_ALREADY_EXIST),
    )
    expect(
      mockAuthRepository.validateUsernameAvailability,
    ).toHaveBeenCalledWith("existinguser")
  })

  it("should throw an error if the email is already taken", async () => {
    mockAuthRepository.validateUsernameAvailability = jest
      .fn()
      .mockResolvedValue(true)
    mockAuthRepository.getUserByEmail = jest
      .fn()
      .mockResolvedValue({ email: "user@example.com" })

    const signUp = new SignUp(
      mockAuthRepository,
      mockPasswordHash,
      mockTokenManager,
    )
    const user = new UserEntity(
      "0",
      "newuser",
      "user@example.com",
      "password123",
      null,
    )

    await expect(signUp.execute(user)).rejects.toThrowError(
      new InvariantError(ERROR.EMAIL_ALREADY_EXIST),
    )
    expect(
      mockAuthRepository.validateUsernameAvailability,
    ).toHaveBeenCalledWith("newuser")
    expect(mockAuthRepository.getUserByEmail).toHaveBeenCalledWith(
      "user@example.com",
    )
  })
})
