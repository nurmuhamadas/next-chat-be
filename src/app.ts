import { Hono } from "hono"
import { createRouter } from "./routes"
import ClientError from "./common/exceptions/client-error"
import { createError } from "./common/lib/utils"
import { ERROR } from "./common/constants/errors"

const app = new Hono()

createRouter(app)

app.onError((error, c) => {
  if (error instanceof ClientError) {
    return c.json(createError(error.message), error.statusCode)
  }

  return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
})

export default {
  ...app,
  port: 8000,
}
