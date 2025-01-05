import { injectable } from "inversify"

import { SessionEntity } from "@/domains/auth/entities/session-entity"
import { LogActivity } from "@/domains/auth/entities/user-log-entity"
import { SessionRepository } from "@/domains/auth/repositories/session-repository"

import { prisma } from "../../orm/prisma"
import { PrismaHelper } from "../../orm/prisma-helper"

@injectable()
export class SessionRepositoryImpl implements SessionRepository {
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
}
