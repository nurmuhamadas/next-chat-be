import * as jwt from "hono/jwt"

import { AuthTokenManager } from "@/app/security/auth-token-manager"
import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"

import { AUTH_SECRET } from "../../../config"

export class JWTTokenManager implements AuthTokenManager {
  generateSessionToken(session: SessionTokenEntity): Promise<string> {
    return jwt.sign(
      {
        ...session,
        createdAt: new Date(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 10,
      },
      AUTH_SECRET,
    )
  }

  generateVerificationToken(email: string, username: string): Promise<string> {
    return jwt.sign(
      {
        email,
        username,
        createdAt: new Date(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 10,
      },
      AUTH_SECRET,
    )
  }

  async verifySessionToken(token: string): Promise<SessionTokenEntity> {
    const payload = await jwt.verify(token, AUTH_SECRET)
    const session = new SessionTokenEntity(
      payload.userId as string,
      payload.username as string,
      payload.deviceId as string,
      payload.email as string,
    )

    return session
  }
}
