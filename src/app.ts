import { Hono } from "hono"
import { createRouter } from "./routes"

const app = new Hono()

createRouter(app)

export default {
  ...app,
  port: 8000,
}
