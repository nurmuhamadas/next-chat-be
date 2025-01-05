import { ServerWebSocket } from "bun"

export abstract class WebSocketManager {
  abstract subscribeTopic(ws: ServerWebSocket): void

  abstract unsubscribeTopic(ws: ServerWebSocket): void

  abstract broadcastMessage(message: string): void
}
