import { createNodeWebSocket } from "@hono/node-ws"
import type { ServerWebSocket } from "bun"
import { Hono } from "hono"

import { app } from "@/app"
import { WebSocketManager } from "@/app/socket/web-socket-manager"
import { container } from "@/infrastuctures/container"
import { KEYS } from "@/infrastuctures/container/keys"

import { sessionMiddleware } from "./middleware/session-middleware"

const { upgradeWebSocket } = createNodeWebSocket({ app })

export const wsRoute = new Hono()
  .get(
    "/messages",
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
  .get("/online")
