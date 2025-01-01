import { SessionEntity } from "../entities/session-entity"

export abstract class SessionRepository {
  abstract createOrUpdateSession(
    data: SessionEntity,
    description?: string,
  ): Promise<SessionEntity>
}
