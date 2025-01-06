import { SessionEntity } from "../entities/session-entity"

export abstract class SessionRepository {
  abstract createOrUpdateSession(
    data: SessionEntity,
    description?: string,
  ): Promise<SessionEntity>

  abstract getSessionByToken(token: string): Promise<SessionEntity | null>

  abstract softDeleteSession(emaiL: string, userId: string): Promise<void>
}
