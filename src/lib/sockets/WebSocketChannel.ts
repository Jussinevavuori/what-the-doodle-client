import { io, Socket } from "socket.io-client";

export class WebSocketChannel {
  readonly socket: Socket;

  constructor() {
    const prod = process.env.NODE_ENV === "production";
    this.socket = io(
      [
        prod ? "wss" : "ws",
        "://",
        process.env.REACT_APP_SERVER_URL ?? "localhost",
        ":8000",
      ].join(""),
      {
        reconnectionDelayMax: 10000,
        transports: ["websocket", "polling", "flashsocket"],
        autoConnect: false,
        secure: prod,
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
