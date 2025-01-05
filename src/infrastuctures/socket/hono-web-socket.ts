import { ServerWebSocket } from "bun"

import { server } from "@/app"
import { WebSocketManager } from "@/app/socket/web-socket-manager"

export class HonoWebSocket implements WebSocketManager {
  static MESSAGE_TOPIC = "message"

  subscribeTopic(ws: ServerWebSocket): void {
    ws.subscribe(HonoWebSocket.MESSAGE_TOPIC)
  }

  unsubscribeTopic(ws: ServerWebSocket): void {
    ws.unsubscribe(HonoWebSocket.MESSAGE_TOPIC)
  }

  broadcastMessage(message: string): void {
    server.publish(HonoWebSocket.MESSAGE_TOPIC, message)
  }
}
