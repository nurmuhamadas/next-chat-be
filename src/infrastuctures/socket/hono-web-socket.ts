import { ServerWebSocket } from "bun"

import { WebSocketManager } from "@/app/socket/web-socket-manager"

const connections = new Map<string, ServerWebSocket>()

export class HonoWebSocket implements WebSocketManager {
  static MESSAGE_TOPIC = "message"
  static ONLINE_TOPIC = "online"

  subscribeTopic(ws: ServerWebSocket, topic: string): void {
    ws.subscribe(topic)
  }

  unsubscribeTopic(ws: ServerWebSocket, topic: string): void {
    ws.unsubscribe(topic)
  }

  saveConnection(ws: ServerWebSocket, userId: string): void {
    connections.set(userId, ws)
  }

  removeConnection(userId: string): void {
    connections.delete(userId)
  }

  broadcastByConnectionKeys(data: string, userIds: string[]): void {
    userIds.forEach((userId) => {
      const ws = connections.get(userId)
      if (ws) {
        ws.send(data)
      }
    })
  }

  broadcastByTopic(ws: ServerWebSocket, topic: string, data: string): void {
    ws.publish(topic, data)
  }

  getConnectionIds(): string[] {
    return Array.from(connections.keys())
  }
}
