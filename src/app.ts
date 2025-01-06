import "reflect-metadata"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { ZodError } from "zod"

import { APP_URL } from "../config"

import { ERROR } from "./common/constants/errors"
import ClientError from "./common/exceptions/client-error"
import { createError, customLogger } from "./common/lib/utils"
import { createRouter } from "./interfaces/routes"

const app = new Hono().basePath("/api")

app.use(logger(customLogger))

app.use(
  "/*",
  cors({
    origin: APP_URL,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
    return c.json(createError(error.message), error.statusCode)
  }

  if (error instanceof ZodError) {
    const response = createError(
      error.errors[0]?.message,
      error.errors[0]?.path,
    )
    return c.json(response, 400)
  }

  if (error instanceof PrismaClientKnownRequestError) {
    console.log(createError(error.message))
    return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
  }

  customLogger("ERROR:", `Message: ${error.message}`)
  return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
})

export default {
  ...app,
  port: 8000,
}
