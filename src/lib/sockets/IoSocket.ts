import { io, Socket } from "socket.io-client";

export class IoSocket {
  readonly socket: Socket;

  constructor() {
    const prod = process.env.NODE_ENV === "production";
    this.socket = io(process.env.REACT_APP_SERVER_URL ?? "localhost", {
      reconnectionDelayMax: 10000,
      transports: ["websocket", "polling", "flashsocket"],
      autoConnect: false,
      secure: prod,
    });
  }

  protected __connect() {
    this.socket.connect();
  }

  protected __disconnect() {
    this.socket.disconnect();
  }

  /**
   * Utility function for emitting
   */
  protected emit(event: string, ...args: any[]) {
    console.log(`Emit ${event}`, args);
    this.socket.emit(event, ...args);
  }
}
