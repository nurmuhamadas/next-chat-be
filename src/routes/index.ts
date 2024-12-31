import { Hono } from "hono"

export const createRouter = (app: Hono) => {
  app.get("/", (c) => {
    return c.text("Hello Hono!")
  })
}
