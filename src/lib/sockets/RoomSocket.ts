import {
  getGameStateSchemaValidationError,
  isGameStateSchema,
} from "../../schemas/gameStateSchema";
import { store } from "../../store";
import { DrawingActionSerializer } from "../drawing/DrawingActionSerializer";
import { Picture } from "../drawing/Picture";
import { PubSubChannel } from "../pubsub/PubSub";
import { WebSocketChannel } from "./WebSocketChannel";
import { z } from "zod";

export class RoomSocket extends WebSocketChannel {
  // ---------------------------------------------------------------------------
  // Static properties
  // ---------------------------------------------------------------------------

  /**
   * Store all created room sockets in memory here
   */
  static Sockets: Record<string, RoomSocket> = {};

  /**
   * Utility function to disconnect and clear all sockets except
   * the ones specified by the `keepIf` function.
   */
  static disconnectAndClearAllSockets(
    opts: { keepIf?: (id: string, r: RoomSocket) => boolean } = {}
  ) {
    const keepIf = opts.keepIf ?? (() => false);
    Object.keys(this.Sockets).forEach((id) => {
      if (keepIf(id, this.Sockets[id])) {
        return;
      }
      this.Sockets[id].__disconnect();
      delete this.Sockets[id];
    });
  }

  /**
   * Schema for errors
   */
  static errorSchema = z.object({
    message: z.string(),
    redirectPath: z.string().optional(),
  });

  /**
   * Pub sub channel for all socket errors
   */
  static errors = new PubSubChannel<
    z.TypeOf<typeof RoomSocket["errorSchema"]>
  >();

  /**
   * Connection events
   */
  static connectionEvents = new PubSubChannel<
    "connected" | "reconnected" | "disconnected"
  >();

  // ---------------------------------------------------------------------------
  // Instance properties
  // ---------------------------------------------------------------------------

  /**
   * Room ID for socket
   */
  readonly roomId: string;

  private _hasConnectedOnce: boolean;

  constructor(roomId: string) {
    super();
    this.roomId = roomId;
    this._hasConnectedOnce = false;

    // If overwriting, disconnect previous socket
    if (RoomSocket.Sockets[roomId]) {
      RoomSocket.Sockets[roomId].__disconnect();
    }
    RoomSocket.Sockets[roomId] = this;
  }

  /**
   * Emit helper
   */
  private emit(event: string, ...args: any[]) {
    // console.log(`EMIT ${event}`, args);
    this.socket.emit(event, ...args);
  }

  /**
   * Send a start game event to the server
   */
  startGame() {
    this.emit("@game/start");
  }

  /**
   * Send a reset game event to the server
   */
  resetGame() {
    this.emit("@game/reset");
  }

  /**
   * Send a guess event to the server
   */
  guess(args: { guess: string; roundId: string }) {
    this.emit("@game/guess", args);
  }

  /**
   * Set the drawing time by sending an update event to the server
   */
  setDrawingTime(drawingTime: number) {
    this.emit("@game/setDrawingTime", { drawingTime });
  }

  /**
   * Make initial choice for topic
   */
  initialChoice(args: { uid: string; topic: string }) {
    this.emit("@game/initialChoice", args);
  }

  /**
   * Make final choice
   */
  finalChoice(args: { uid: string; cardId: string }) {
    this.emit("@game/finalChoice", args);
  }

  /**
   * Connect a picture for broadcasting all drawings on it as events
   * to the server
   */
  connectPicture(picture: Picture) {
    return picture.onActionChannel.subscribe((action) => {
      const round = store.getState().game.currentRound;
      if (round) {
        this.emit("@game/draw", {
          drawingAction: DrawingActionSerializer.serializeOne(action),
          roundId: round.id,
        });
      }
    });
  }

  /**
   * Connect the socket and join a room
   */
  connect() {
    this.__connect();

    // When connected, join game socket room
    this.socket.on("connect", () => {
      console.log("Connected");
      RoomSocket.connectionEvents.publish(
        this._hasConnectedOnce ? "reconnected" : "connected"
      );
      this._hasConnectedOnce = true;
      this.emit("@game/join", {
        roomId: this.roomId,
        userId: store.getState().game.user.id,
        userName: store.getState().game.user.name,
        userAvatar: store.getState().game.user.avatar,
      });
    });

    // Disconnected
    this.socket.on("disconnect", () => {
      RoomSocket.connectionEvents.publish("disconnected");
      console.log("Disconnected");
    });

    // Sync game state to store
    this.socket.on("@game/state", async (json) => {
      try {
        const state = JSON.parse(json);
        if (isGameStateSchema(state)) {
          store.getActions().game.updateGameState(state);
        } else {
          console.error(
            "Invalid game state",
            state,
            getGameStateSchemaValidationError(state)
          );
        }
      } catch (e) {
        console.error("Invalid game state:", json, e);
      }
    });

    // Listen to drawing time left updates separately
    this.socket.on("@game/drawingTimeLeft", (raw) => {
      try {
        const drawingTimeLeft = Number.parseInt(raw);
        if (!Number.isNaN(drawingTimeLeft) && drawingTimeLeft >= 0) {
          store.getActions().game.setDrawingTimeLeft(drawingTimeLeft);
        }
      } catch (e) {
        console.error("Invalid drawing time left:", raw, e);
      }
    });

    // Errors
    this.socket.on("error", (err) => {
      const parsed = RoomSocket.errorSchema.safeParse(JSON.parse(err));

      if (parsed.success) {
        RoomSocket.errors.publish(parsed.data);
      } else {
        console.warn(parsed.error);
      }
    });

    (window as any).emit = (action: string, msg: any) => {
      this.emit(action, JSON.stringify(msg));
    };
  }
}
