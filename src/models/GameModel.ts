import { action, Action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { User } from "../lib/auth/User";
import { Brush } from "../lib/drawing/Brush";
import { GameStateSchema } from "../schemas/gameStateSchema";

export interface GameModel {
  // ---------------------------------------------------------------------------
  // STATE PROPERTIES
  // ---------------------------------------------------------------------------

  /**
   * Current user
   */
  user: User;

  /**
   * All players from the game object.
   */
  players: User[];

  /**
   * Whether the game has been started or not
   */
  gameStatus: GameStatus;

  /**
   * All round objects
   */
  rounds: GameRound[];

  /**
   * All game cards
   */
  cards: GameCard[];

  /**
   * Total number of rounds
   */
  nRounds: number;

  /**
   * Current round index
   */
  currentRoundIndex: number;

  /**
   * Amount of time to draw
   */
  drawingTime: number;

  /**
   * Amount of time left to draw
   */
  drawingTimeLeft: number;

  /**
   * Final guesses
   */
  finalGuesses: Record<string, string>;

  /**
   * Number of max players per room
   */
  maxPlayers: number;

  /**
   * Current brush for drawing onto the picture
   */
  brush: Brush;

  // ---------------------------------------------------------------------------
  // SETTERS
  // ---------------------------------------------------------------------------

  setUserName: Action<GameModel, string>;
  setUserAvatar: Action<GameModel, string>;
  setPlayers: Action<GameModel, User[]>;
  setGameStatus: Action<GameModel, GameStatus>;
  setRounds: Action<GameModel, GameRound[]>;
  setCards: Action<GameModel, GameCard[]>;
  setNRounds: Action<GameModel, number>;
  setCurrentRoundIndex: Action<GameModel, number>;
  setDrawingTime: Action<GameModel, number>;
  setDrawingTimeLeft: Action<GameModel, number>;
  setFinalGuesses: Action<GameModel, Record<string, string>>;
  setMaxPlayers: Action<GameModel, number>;
  setBrush: Action<GameModel, Brush>;

  /**
   * Completely reset all game-specific variables in the state
   */
  resetState: Action<GameModel, void>;

  // ---------------------------------------------------------------------------
  // COMPUTED PROPERTIES
  // ---------------------------------------------------------------------------

  /**
   * Compute current round object. Undefined when game has not been started
   * or due to error.
   */
  currentRound: Computed<GameModel, GameRound | undefined>;

  /**
   * Compute current card object. Undefined when game has not been started or
   * due to error.
   */
  currentCard: Computed<GameModel, GameCard | undefined>;

  // ---------------------------------------------------------------------------
  // THUNKS
  // ---------------------------------------------------------------------------

  /**
   * Thunk for updating the game state from a game state object. Used for
   * receiving udpates from the server and updating them to the store.
   */
  updateGameState: Thunk<GameModel, GameStateSchema>;
}

export const gameModel: GameModel = {
  // ---------------------------------------------------------------------------
  // STATE PROPERTIES
  // ---------------------------------------------------------------------------

  user: User.getSelf(),
  players: [],
  gameStatus: "idle",
  rounds: [],
  cards: [],
  nRounds: 0,
  currentRoundIndex: 0,
  drawingTime: 0,
  drawingTimeLeft: 0,
  finalGuesses: {},
  maxPlayers: 0,
  brush: Brush.DefaultBrush,

  // ---------------------------------------------------------------------------
  // SETTERS
  // ---------------------------------------------------------------------------

  setUserName: action((state, name) => {
    const user = User.getSelf();
    user.name = name;
    User.saveSelf(user);
    state.user = user;
  }),
  setUserAvatar: action((state, avatar) => {
    const user = User.getSelf();
    user.avatar = avatar;
    User.saveSelf(user);
    state.user = user;
  }),
  setPlayers: action((state, next) => {
    state.players = next;
  }),
  setGameStatus: action<GameModel, GameStatus>((state, next) => {
    state.gameStatus = next;
  }),
  setRounds: action((state, next) => {
    state.rounds = next;
  }),
  setCards: action((state, next) => {
    state.cards = next;
  }),
  setNRounds: action((state, next) => {
    state.nRounds = next;
  }),
  setCurrentRoundIndex: action((state, next) => {
    state.currentRoundIndex = next;
  }),
  setDrawingTime: action((state, next) => {
    state.drawingTime = next;
  }),
  setDrawingTimeLeft: action((state, next) => {
    state.drawingTimeLeft = next;
  }),
  setFinalGuesses: action((state, next) => {
    state.finalGuesses = next;
  }),
  setMaxPlayers: action((state, next) => {
    state.maxPlayers = next;
  }),
  setBrush: action((state, next) => {
    state.brush = next;
  }),
  resetState: action((state) => {
    state.players = [];
    state.gameStatus = "idle";
    state.rounds = [];
    state.cards = [];
    state.nRounds = 0;
    state.currentRoundIndex = 0;
    state.drawingTime = 0;
    state.drawingTimeLeft = 0;
    state.finalGuesses = {};
    state.maxPlayers = 0;
  }),

  // ---------------------------------------------------------------------------
  // COMPUTED PROPERTIES
  // ---------------------------------------------------------------------------

  currentRound: computed((state) => {
    switch (state.gameStatus) {
      case "idle":
      case "choose":
      case "final":
      case "finish":
        return undefined;
      case "draw":
        return state.rounds.find(
          (r) =>
            r.roundNumber === state.currentRoundIndex &&
            r.drawerId === state.user.id
        );
      case "guess":
        return state.rounds.find(
          (r) =>
            r.roundNumber === state.currentRoundIndex &&
            r.guesserId === state.user.id
        );
    }
  }),

  currentCard: computed((state) => {
    switch (state.gameStatus) {
      case "idle":
      case "final":
      case "finish":
        return undefined;
      case "choose":
        return state.cards.find(
          (c) =>
            c.id ===
            state.rounds.find(
              (r) => r.roundNumber === 0 && r.drawerId === state.user.id
            )?.cardId
        );
      case "draw":
        return state.cards.find(
          (c) =>
            c.id ===
            state.rounds.find(
              (r) =>
                r.roundNumber === state.currentRoundIndex &&
                r.drawerId === state.user.id
            )?.cardId
        );
      case "guess":
        return state.cards.find(
          (c) =>
            c.id ===
            state.rounds.find(
              (r) =>
                r.roundNumber === state.currentRoundIndex &&
                r.guesserId === state.user.id
            )?.cardId
        );
    }
  }),

  // ---------------------------------------------------------------------------
  // THUNKS
  // ---------------------------------------------------------------------------

  updateGameState: thunk(async (actions, game) => {
    // Update state
    actions.setCards(game.cards);
    actions.setCurrentRoundIndex(game.currentRoundIndex);
    actions.setGameStatus(game.status);
    actions.setNRounds(game.nRounds);
    actions.setRounds(game.rounds);
    actions.setDrawingTime(game.drawingTime);
    actions.setFinalGuesses(game.finalGuesses);
    actions.setMaxPlayers(game.maxPlayers);
    actions.setPlayers(
      game.players.map(
        (p) =>
          new User(p.id, {
            name: p.name,
            avatar: p.avatar,
            isOnline: p.isOnline,
          })
      )
    );
  }),
};
