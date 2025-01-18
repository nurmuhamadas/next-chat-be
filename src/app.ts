import "reflect-metadata"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { ServerWebSocket } from "bun"
import { Hono } from "hono"
import { createBunWebSocket } from "hono/bun"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

import { APP_URL } from "../config"

import { ERROR } from "./common/constants/errors"
import ClientError from "./common/exceptions/client-error"
import InvariantError from "./common/exceptions/invariant-error"
import { createError, customLogger } from "./common/lib/utils"
import { createRouter } from "./interfaces/routes"

const { websocket } = createBunWebSocket<ServerWebSocket>()

const app = new Hono().basePath("/api")

app.use(logger(customLogger))

app.use(
  "/*",
  cors({
    origin: APP_URL,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    maxAge: 600,
    credentials: true,
  }),
)

createRouter(app)

app.onError((error, c) => {
  if (error instanceof ClientError) {
    customLogger(
      "ERROR:",
      `Message: ${error.message}`,
      `code: ${error.statusCode}`,
    )

    if (error instanceof InvariantError) {
      return c.json(createError(error.message, error.path), error.statusCode)
    }

    return c.json(createError(error.message), error.statusCode)
  }

  if (error instanceof PrismaClientKnownRequestError) {
    console.log(createError(error.message))
    return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
  }

  customLogger("ERROR:", `Message: ${error.message}`)
  return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
})

export const server = Bun.serve({
  fetch: app.fetch,
  port: 8000,
  websocket: websocket,
})

export default {
  ...app,
  websocket,
  port: 8000,
}
