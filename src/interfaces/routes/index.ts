import { Hono } from "hono"

import authRoute from "./auth"

export const createRouter = (app: Hono) => {
  app.route("/auth", authRoute)
}
