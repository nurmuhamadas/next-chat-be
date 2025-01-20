import "reflect-metadata"

import { serve } from "@hono/node-server"
import { createNodeWebSocket } from "@hono/node-ws"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { ServerWebSocket } from "bun"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

import { WebSocketManager } from "./app/socket/web-socket-manager"
import { ERROR } from "./common/constants/errors"
import ClientError from "./common/exceptions/client-error"
import InvariantError from "./common/exceptions/invariant-error"
import { createError, customLogger } from "./common/lib/utils"
import { container } from "./infrastuctures/container"
import { KEYS } from "./infrastuctures/container/keys"
import { createRouter } from "./interfaces/routes"
import { sessionMiddleware } from "./interfaces/routes/middleware/session-middleware"

const app = new Hono().basePath("/api")

app.use(logger(customLogger))

app.use(
  "/*",
  cors({
    origin: process.env.APP_URL!,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    maxAge: 600,
    credentials: true,
  }),
)

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app })

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

  console.log(error)
  customLogger("ERROR:", `Message: ${error.message}`)
  return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
})

app
  .get(
    "ws/messages",
    sessionMiddleware,
    upgradeWebSocket((c) => {
      const session = c.get("userSession")

      return {
        onOpen(_, ws) {
          if (!session) {
            ws.close(1008, "Unauthorized")
            return
          }

          const websocket = container.get<WebSocketManager>(
            KEYS.WebSocketManager,
          )
          const rawWs = ws.raw as ServerWebSocket

          websocket.saveConnection(rawWs, session.userId)

          const onlineUserIds = websocket.getConnectionIds()

          websocket.broadcastByConnectionKeys(
            JSON.stringify({ type: "ONLINE", data: onlineUserIds }),
            onlineUserIds,
          )
        },
        onClose: () => {
          const websocket = container.get<WebSocketManager>(
            KEYS.WebSocketManager,
          )

          websocket.removeConnection(session.userId)

          const onlineUserIds = websocket.getConnectionIds()
          websocket.broadcastByConnectionKeys(
            JSON.stringify({ type: "ONLINE", data: onlineUserIds }),
            onlineUserIds,
          )
        },
      }
    }),
  )
  .get("ws/online")

const server = serve({
  fetch: app.fetch,
  port: 8000,
})

injectWebSocket(server)

export default server
