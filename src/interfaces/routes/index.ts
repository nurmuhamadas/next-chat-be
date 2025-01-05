import { Hono } from "hono"

import authRoute from "./auth"
import { wsRoute } from "./websocket"

export const createRouter = (app: Hono) => {
  app.route("/auth", authRoute)
  app.route("/ws", wsRoute)
}
