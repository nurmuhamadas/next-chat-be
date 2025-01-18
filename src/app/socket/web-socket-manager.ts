import { ServerWebSocket } from "bun"

export abstract class WebSocketManager {
  abstract subscribeTopic(ws: ServerWebSocket): void

  abstract unsubscribeTopic(ws: ServerWebSocket): void

  abstract saveConnection(ws: ServerWebSocket, userId: string): void

  abstract removeConnection(userId: string): void

  abstract broadcastMessage(message: string, userIds: string[]): void
}
