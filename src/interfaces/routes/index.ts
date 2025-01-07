import { Hono } from "hono"

import authRoute from "./auth"
import settingRoute from "./setting"
import userRoute from "./user"

export const createRouter = (app: Hono) => {
  app.route("/auth", authRoute)
  app.route("/users", userRoute)
  app.route("/settings", settingRoute)
}
