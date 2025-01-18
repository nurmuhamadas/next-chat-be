import { injectable } from "inversify"

import { VerificationTokenEntity } from "@/domains/auth/entities/verification-token-entity"
import { TokenRepository } from "@/domains/auth/repositories/token-repository"

import { prisma } from "../../orm/prisma"

@injectable()
export class TokenRepositoryImpl implements TokenRepository {
  async createOrUpdateVerificationToken({
    email,
    expiresAt,
    token,
  }: VerificationTokenEntity): Promise<VerificationTokenEntity> {
    const result = await prisma.verificationToken.upsert({
      where: { email },
      create: { email, token, expiresAt },
      update: { token, expiresAt },
    })

    return new VerificationTokenEntity(
      result.email,
      result.token,
      result.expiresAt,
    )
  }
}
