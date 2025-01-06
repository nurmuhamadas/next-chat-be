import { addDays, addYears } from "date-fns"
import { Context } from "hono"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { v7 as uuidV7 } from "uuid"

import { SessionEntity } from "@/domains/auth/entities/session-entity"

import { APP_URL } from "../../../config"

export class CookieHelper {
  static AUTH_COOKIE_KEY = "next-chat-session"
  static DEVICE_ID_COOKIE_KEY = "device-id"

  static getDeviceId(c: Context): string | undefined {
    return getCookie(c, this.DEVICE_ID_COOKIE_KEY)
  }

  static generateDeviceId(): string {
    return `device-${uuidV7()}-${Date.now()}`
  }

  static getSessionExpired = () => addDays(new Date(), 30)

  static getAuthCookie(c: Context): string | undefined {
    return getCookie(c, this.AUTH_COOKIE_KEY)
  }

  static setAuthCookies(c: Context, session: SessionEntity) {
    const deviceId = this.getDeviceId(c)
    if (!deviceId) {
      setCookie(c, this.DEVICE_ID_COOKIE_KEY, session.deviceId, {
        path: "/",
        domain: APP_URL,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: addYears(new Date(), 1),
      })
    }
    setCookie(c, this.AUTH_COOKIE_KEY, session.token, {
      path: "/",
      domain: APP_URL,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: this.getSessionExpired(),
    })
  }

  static deleteAuthCookie(c: Context) {
    deleteCookie(c, this.AUTH_COOKIE_KEY, {
      path: "/",
      domain: APP_URL,
    })
  }
}
