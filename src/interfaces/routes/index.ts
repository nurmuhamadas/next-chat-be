import { Hono } from "hono"

import authRoute from "./auth"
import blockedUserRoute from "./blocked-user"
import groupRoute from "./group"
import privateChatRoute from "./private-chat"
import settingRoute from "./setting"
import userRoute from "./user"

export const createRouter = (app: Hono) => {
  app.route("/auth", authRoute)
  app.route("/users", userRoute)
  app.route("/settings", settingRoute)
  app.route("/blocked-users", blockedUserRoute)
  app.route("/private-chat", privateChatRoute)
  app.route("/groups", groupRoute)
}
