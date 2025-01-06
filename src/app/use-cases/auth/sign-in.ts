import { Context } from "hono"
import { inject, injectable } from "inversify"

import { ERROR } from "@/common/constants/errors"
import InvariantError from "@/common/exceptions/invariant-error"
import { CookieHelper } from "@/common/lib/cookie-helper"
import { SessionEntity } from "@/domains/auth/entities/session-entity"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { VerificationTokenEntity } from "@/domains/auth/entities/verification-token-entity"
import { AuthRepository } from "@/domains/auth/repositories/auth-repository"
import { SessionRepository } from "@/domains/auth/repositories/session-repository"
import { TokenRepository } from "@/domains/auth/repositories/token-repository"
import { KEYS } from "@/infrastuctures/container/keys"

import { AuthTokenManager } from "../../security/auth-token-manager"
import { PasswordHash } from "../../security/password-hash"

@injectable()
export class SignIn {
  constructor(
    @inject(KEYS.AuthRepository) private authRepository: AuthRepository,
    @inject(KEYS.SessionRepository)
    private sessionRepository: SessionRepository,
    @inject(KEYS.TokenRepository)
    private tokenRepository: TokenRepository,
    @inject(KEYS.PasswordHash) private passwordHash: PasswordHash,
    @inject(KEYS.AuthTokenManager) private tokenManager: AuthTokenManager,
  ) {}

  async execute(
    c: Context,
    user: {
      email: string
      password: string
    },
    userAgent: string,
  ): Promise<SignInStatus> {
    const existingUser = await this.authRepository.getUserByEmail(user.email)
    if (!existingUser) {
      throw new InvariantError(ERROR.EMAIL_NOT_REGISTERED)
    }

    const isPasswordValid = await this.passwordHash.comparePassword(
      user.password,
      existingUser.password,
    )
    if (!isPasswordValid) {
      throw new InvariantError(ERROR.INVALID_CREDENTIALS)
    }

    if (!existingUser.isVerified) {
      return "unverified"
    }

    const setting = existingUser.setting
    if (setting?.enable2FA) {
      const token = await this.tokenManager.generateVerificationToken(
        user.email,
        existingUser.username,
      )
      const verificationToken = new VerificationTokenEntity(
        user.email,
        token,
        this.tokenManager.getTokenExpired(),
      )
      await this.tokenRepository.createOrUpdateVerificationToken(
        verificationToken,
      )
      // TODO: send email login

      return "2fa"
    }

    const deviceId =
      CookieHelper.getDeviceId(c) ?? CookieHelper.generateDeviceId()
    const sessionTokenEntity = new SessionTokenEntity(
      existingUser.id,
      existingUser.username,
      deviceId,
      user.email,
    )
    const token =
      await this.tokenManager.generateSessionToken(sessionTokenEntity)

    const sessionEntity = new SessionEntity(
      existingUser.id,
      token,
      deviceId,
      userAgent,
      user.email,
      this.tokenManager.getTokenExpired(),
    )
    const session = await this.sessionRepository.createOrUpdateSession(
      sessionEntity,
      `Login from ${userAgent}`,
    )

    CookieHelper.setAuthCookies(c, session)

    return "success"
  }
}
