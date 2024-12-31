import { Hono } from "hono"
import { logger } from "hono/logger"

import { ERROR } from "./common/constants/errors"
import ClientError from "./common/exceptions/client-error"
import { createError, customLogger } from "./common/lib/utils"
import { createRouter } from "./routes"

const app = new Hono()

app.use(logger(customLogger))

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

  customLogger("ERROR:", `Message: ${error.message}`)
  return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
})

export default {
  ...app,
  port: 8000,
}
