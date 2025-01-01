import { VerificationTokenEntity } from "../entities/verification-token-entity"

export abstract class TokenRepository {
  abstract createOrUpdateVerificationToken(
    data: VerificationTokenEntity,
  ): Promise<VerificationTokenEntity>
}
