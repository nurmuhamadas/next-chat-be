import { Context } from "hono"
import { inject, injectable } from "inversify"

import { CookieHelper } from "@/common/lib/cookie-helper"
import { SessionRepository } from "@/domains/auth/repositories/session-repository"
import { KEYS } from "@/infrastuctures/container/keys"

@injectable()
export class SignOut {
  constructor(
    @inject(KEYS.SessionRepository)
    private sessionRepository: SessionRepository,
  ) {}

  async execute(c: Context): Promise<void> {
    const token = CookieHelper.getAuthCookie(c)

    if (!token) return

    const session = await this.sessionRepository.getSessionByToken(token)

    if (session) {
      await this.sessionRepository.softDeleteSession(
        session.email,
        session.userId,
      )
    }

    CookieHelper.deleteAuthCookie(c)
  }
}
