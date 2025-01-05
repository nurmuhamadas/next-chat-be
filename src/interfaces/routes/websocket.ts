import type { ServerWebSocket } from "bun"
import { Hono } from "hono"
import { createBunWebSocket } from "hono/bun"

import { WebSocketManager } from "@/app/socket/web-socket-manager"
import { container } from "@/infrastuctures/container"
import { KEYS } from "@/infrastuctures/container/keys"

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>()

export const wsRoute = new Hono().get(
  "/",
  upgradeWebSocket(() => {
    return {
      onOpen(_, ws) {
        const websocket = container.get<WebSocketManager>(KEYS.WebSocketManager)
        const rawWs = ws.raw as ServerWebSocket

        websocket.subscribeTopic(rawWs)
      },
      onMessage(event) {
        const websocket = container.get<WebSocketManager>(KEYS.WebSocketManager)

        // TODO: change later
        websocket.broadcastMessage(event.data.toString())
      },
      onClose: (_, ws) => {
        const websocket = container.get<WebSocketManager>(KEYS.WebSocketManager)
        const rawWs = ws.raw as ServerWebSocket

        websocket.unsubscribeTopic(rawWs)
      },
    }
  }),
)
