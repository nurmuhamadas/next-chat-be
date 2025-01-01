import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"

export abstract class AuthTokenManager {
  abstract generateSessionToken(session: SessionTokenEntity): Promise<string>

  abstract generateVerificationToken(
    email: string,
    username: string,
  ): Promise<string>

  abstract verifySessionToken(token: string): Promise<SessionTokenEntity>

  abstract getTokenExpired(): Date
}
