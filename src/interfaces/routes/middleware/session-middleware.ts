import { createMiddleware } from "hono/factory"
import { JwtTokenExpired, JwtTokenInvalid } from "hono/utils/jwt/types"

import { AuthTokenManager } from "@/app/security/auth-token-manager"
import { ERROR } from "@/common/constants/errors"
import AuthenticationError from "@/common/exceptions/authentication-error"
import { CookieHelper } from "@/common/lib/cookie-helper"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"
import { container } from "@/infrastuctures/container"
import { KEYS } from "@/infrastuctures/container/keys"

type AdditionalContext = {
  Variables: {
    userSession: SessionTokenEntity
  }
}

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    try {
      const token = CookieHelper.getAuthCookie(c)

      if (!token) {
        throw ERROR.UNAUTHORIZE
      }

      const tokenManager = container.get<AuthTokenManager>(
        KEYS.AuthTokenManager,
      )
      const session = await tokenManager.verifySessionToken(token)

      const isCreatingProfile =
        c.req.path === "/api/users" && c.req.method === "POST"
      if (!isCreatingProfile && !session.isProfileComplete) {
        throw ERROR.UNAUTHORIZE
      }

      c.set("userSession", session)

      await next()
    } catch (error) {
      // CookieHelper.deleteAuthCookie(c)

      if (error instanceof JwtTokenInvalid) {
        throw new AuthenticationError(ERROR.INVALID_TOKEN)
      }
      if (error instanceof JwtTokenExpired) {
        throw new AuthenticationError(ERROR.TOKEN_EXPIRED)
      }
      throw new AuthenticationError(ERROR.UNAUTHORIZE)
    }
  },
)
