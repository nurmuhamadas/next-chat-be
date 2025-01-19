import { ServerWebSocket } from "bun"

export abstract class WebSocketManager {
  abstract subscribeTopic(ws: ServerWebSocket, topic: string): void

  abstract unsubscribeTopic(ws: ServerWebSocket, topic: string): void

  abstract saveConnection(ws: ServerWebSocket, userId: string): void

  abstract removeConnection(userId: string): void

  abstract broadcastByConnectionKeys(message: string, userIds: string[]): void

  abstract broadcastByTopic(
    ws: ServerWebSocket,
    topic: string,
    data: string,
  ): void

  abstract getConnectionIds(): string[]
}
