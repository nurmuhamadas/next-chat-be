import { injectable } from "inversify"

import { UserEntity } from "@/domains/auth/entities/user-entity"
import { AuthRepository } from "@/domains/auth/repositories/auth-repository"

import { prisma } from "../../orm/prisma"

@injectable()
export class AuthRepositoryImpl implements AuthRepository {
  async validateUsernameAvailability(username: string): Promise<boolean> {
    const result = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    })

    return !result
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const result = await prisma.user.findUnique({
      where: { email },
    })
    if (!result) return null

    return new UserEntity(
      result.id,
      result.username,
      result.email,
      result.password,
      result.emailVerifiedAt,
    )
  }

  async getUserWithSettingAndProfileByEmail(
    email: string,
  ): Promise<UserEntity | null> {
    const result = await prisma.user.findUnique({
      where: { email },
      include: {
        setting: { select: { enable2FA: true } },
        profile: { select: { userId: true } },
      },
    })
    if (!result) return null

    const setting = result.setting ?? undefined

    const profile = result.profile ?? undefined

    return new UserEntity(
      result.id,
      result.username,
      result.email,
      result.password,
      result.emailVerifiedAt,
      setting,
      profile,
    )
  }

  async createUser(
    username: string,
    email: string,
    password: string,
    token: string,
    expiresAt: Date,
  ): Promise<UserEntity> {
    const result = await prisma.user.create({
      data: {
        username,
        email,
        password,
        verificationToken: {
          create: { token, expiresAt },
        },
      },
    })

    return new UserEntity(
      result.id,
      result.username,
      result.email,
      result.password,
      result.emailVerifiedAt,
    )
  }
}
