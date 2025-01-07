import { Hono } from "hono"

import authRoute from "./auth"
import userRoute from "./user"

export const createRouter = (app: Hono) => {
  app.route("/auth", authRoute)
  app.route("/users", userRoute)
}
