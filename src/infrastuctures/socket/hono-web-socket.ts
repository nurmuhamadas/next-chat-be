import { ServerWebSocket } from "bun"

import { WebSocketManager } from "@/app/socket/web-socket-manager"

const connections = new Map<string, ServerWebSocket>()

export class HonoWebSocket implements WebSocketManager {
  static MESSAGE_TOPIC = "message"

  subscribeTopic(ws: ServerWebSocket): void {
    ws.subscribe(HonoWebSocket.MESSAGE_TOPIC)
  }

  unsubscribeTopic(ws: ServerWebSocket): void {
    ws.unsubscribe(HonoWebSocket.MESSAGE_TOPIC)
  }

  saveConnection(ws: ServerWebSocket, userId: string): void {
    connections.set(userId, ws)
  }

  removeConnection(userId: string): void {
    connections.delete(userId)
  }

  broadcastMessage(message: string, userIds: string[]): void {
    userIds.forEach((userId) => {
      const ws = connections.get(userId)
      if (ws) {
        ws.send(message)
      }
    })
  }
}
