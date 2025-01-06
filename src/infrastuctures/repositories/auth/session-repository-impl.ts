import { injectable } from "inversify"

import { SessionEntity } from "@/domains/auth/entities/session-entity"
import { LogActivity } from "@/domains/auth/entities/user-log-entity"
import { SessionRepository } from "@/domains/auth/repositories/session-repository"

import { prisma } from "../../orm/prisma"
import { PrismaHelper } from "../../orm/prisma-helper"

@injectable()
export class SessionRepositoryImpl implements SessionRepository {
  async getSessionByToken(token: string): Promise<SessionEntity | null> {
    const result = await prisma.session.findUnique({
      where: { token },
      include: { user: { select: { id: true } } },
    })

    if (!result) return null

    return new SessionEntity(
      result.user.id,
      result.token,
      result.deviceId,
      result.userAgent,
      result.email,
      result.expiresAt,
    )
  }

  async createOrUpdateSession(
    { userId, email, userAgent, deviceId, expiresAt, token }: SessionEntity,
    description?: string,
  ): Promise<SessionEntity> {
    const userLogs = {
      userId,
      description,
    }
    const result = await prisma.session.upsert({
      where: { email },
      create: {
        deviceId,
        token,
        userAgent,
        email,
        expiresAt,
        userLogs: {
          create: {
            ...userLogs,
            activity: PrismaHelper.convertLogActivity(
              LogActivity.LOGIN_NEW_DEVICE,
            ),
          },
        },
      },
      update: {
        token,
        expiresAt,
        userLogs: {
          create: {
            ...userLogs,
            activity: PrismaHelper.convertLogActivity(LogActivity.LOGIN),
          },
        },
      },
    })

    return new SessionEntity(
      userId,
      result.token,
      result.deviceId,
      result.userAgent,
      result.email,
      result.expiresAt,
    )
  }

  async softDeleteSession(email: string, userId: string): Promise<void> {
    await prisma.session.update({
      where: { email },
      data: {
        expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        userLogs: {
          create: {
            activity: "LOGOUT",
            userId,
          },
        },
      },
    })
  }
}
