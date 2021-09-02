import { io, Socket } from "socket.io-client";

export class WebSocketChannel {
  readonly socket: Socket;

  constructor() {
    this.socket = io("ws://192.168.10.35:8000", {
      reconnectionDelayMax: 10000,
      transports: ["websocket", "polling", "flashsocket"],
      autoConnect: false,
    });
  }

  protected __connect() {
    this.socket.connect();
  }

  protected __disconnect() {
    this.socket.disconnect();
  }
}