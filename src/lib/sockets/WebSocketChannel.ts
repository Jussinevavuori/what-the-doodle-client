import { io, Socket } from "socket.io-client";

export class WebSocketChannel {
  readonly socket: Socket;

  constructor() {
    this.socket = io(
      `ws://${process.env.REACT_APP_SERVER_URL ?? "localhost"}:8000`,
      {
        reconnectionDelayMax: 10000,
        transports: ["websocket", "polling", "flashsocket"],
        autoConnect: false,
      }
    );
  }

  protected __connect() {
    this.socket.connect();
  }

  protected __disconnect() {
    this.socket.disconnect();
  }
}
