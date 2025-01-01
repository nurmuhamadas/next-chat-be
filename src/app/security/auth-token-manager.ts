import { SessionTokenEntity } from "@/domains/auth/entities/session-token-entity"

export interface AuthTokenManager {
  generateSessionToken(session: SessionTokenEntity): Promise<string>

  generateVerificationToken(email: string, username: string): Promise<string>

  verifySessionToken(token: string): Promise<SessionTokenEntity>

  getTokenExpired(): Date
}
