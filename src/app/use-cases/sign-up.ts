import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import { UserEntity } from "@/domains/auth/entities/user-entity"
import { AuthRepository } from "@/domains/auth/repositories/auth-repository"
import { KEYS } from "@/infrastuctures/container/keys"

import { AuthTokenManager } from "../security/auth-token-manager"
import { PasswordHash } from "../security/password-hash"

@injectable()
export class SignUp {
  constructor(
    @inject(KEYS.AuthRepository) private authRepository: AuthRepository,
    @inject(KEYS.PasswordHash) private passwordHash: PasswordHash,
    @inject(KEYS.AuthTokenManager) private tokenManager: AuthTokenManager,
  ) {}

  async execute(user: {
    username: string
    email: string
    password: string
  }): Promise<UserEntity> {
    const isUsernameAvailable =
      await this.authRepository.validateUsernameAvailability(user.username)
    if (!isUsernameAvailable) {
      throw new InvariantError(ERROR.USERNAME_ALREADY_EXIST)
    }

    const existingUser = await this.authRepository.getUserByEmail(user.email)
    if (existingUser) {
      throw new InvariantError(ERROR.EMAIL_ALREADY_EXIST)
    }

    const hashedPassword = await this.passwordHash.hash(user.password)

    const token = await this.tokenManager.generateVerificationToken(
      user.email,
      user.username,
    )

    const createdUser = await this.authRepository.createUser(
      user.username,
      user.email,
      hashedPassword,
      token,
      this.tokenManager.getTokenExpired(),
    )

    const userEntity = new UserEntity(
      createdUser.id,
      createdUser.username,
      createdUser.email,
      createdUser.password,
      createdUser.emailVerifiedAt,
    )

    return userEntity
  }
}
