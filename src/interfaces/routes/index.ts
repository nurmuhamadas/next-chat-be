import { Hono } from "hono"

import authRoute from "./auth"
import blockedUserRoute from "./blocked-user"
import channelRoute from "./channel"
import groupRoute from "./group"
import messageRoute from "./message"
import privateChatRoute from "./private-chat"
import roomRoute from "./room"
import settingRoute from "./setting"
import userRoute from "./user"
import { wsRoute } from "./websocket"

export const createRouter = (app: Hono) => {
  app.route("/auth", authRoute)
  app.route("/users", userRoute)
  app.route("/settings", settingRoute)
  app.route("/blocked-users", blockedUserRoute)
  app.route("/private-chat", privateChatRoute)
  app.route("/groups", groupRoute)
  app.route("/channels", channelRoute)
  app.route("/rooms", roomRoute)
  app.route("/messages", messageRoute)
  app.route("/ws", wsRoute)
}
