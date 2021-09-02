type UnwrapArray<T> = T extends Array<infer E> ? E : never;

/**
 * All drawing actions that can be taken and later replicated.
 *
 * - `DRAW` (`d`)		Draws either a point if the last action was not a `DRAW
 * 									action or a stroke from the last `DRAW` action's coordinates
 * 									to the new coordinates. Uses the current brush.
 *
 * - `FILL` (`f`)		Fills an area starting from the point where the cursor was
 * 									clicked with the current brush's color.
 */
type DrawingActionType = "DRAW" | "FILL" | "CLEAR";

/**
 * Type of arguments for the apply function
 */
type DrawingActionApplyOptions = {
  picture: import("./lib/drawing/Picture").Picture;
  preventAnimation: boolean;
};

/**
 * Drawing actions can either be from a local source (self-drawn)
 * or from a server source (drawn by peer)
 */
type DrawingActionSource = "local" | "server";

/**
 * All drawing actions contain a type, type guard functions and the
 * apply function which is used to apply the action onto a picture
 */
interface IDrawingAction {
  type: DrawingActionType;
  source: DrawingActionSource;
  isLocalAction(): boolean;
  isServerAction(): boolean;
  isDrawAction(): this is import("./lib/drawing/DrawDrawingAction").DrawDrawingAction;
  isFillAction(): this is import("./lib/drawing/FillDrawingAction").FillDrawingAction;
  isClearAction(): this is import("./lib/drawing/ClearDrawingAction").ClearDrawingAction;
  apply(opts: DrawingActionApplyOptions): Promise<void>;
}

/**
 * List of all drawing action classes
 */
type DrawingAction =
  | import("./lib/drawing/DrawDrawingAction").DrawDrawingAction
  | import("./lib/drawing/FillDrawingAction").FillDrawingAction
  | import("./lib/drawing/ClearDrawingAction").ClearDrawingAction;

/**
 * Utility shortcut for x,y-coordinate pair object type
 */
type Point = { x: number; y: number };

/**
 * Describes a single round where a picture is drawn and then guessed by the
 * specified players. All rounds belong to a single card.
 */
type GameRound = UnwrapArray<
  import("./schemas/gameStateSchema").GameStateSchema["rounds"]
>;

/**
 * A single card consists of an initial title and multiple rounds which are
 * player alternating between drawing the latest guess (starting with the
 * initial title) and guessing the latest drawing. The title can be a free
 * player input or chosen from the given title options.
 */
type GameCard = UnwrapArray<
  import("./schemas/gameStateSchema").GameStateSchema["cards"]
>;

type GamePlayer = UnwrapArray<
  import("./schemas/gameStateSchema").GameStateSchema["players"]
>;

/**
 * Current state:
 * - `"idle"` 		= Not starterd
 * - `"choose"`		= Choose titles
 * - `"draw"` 		= A round is active in drawing phase
 * - `"guess"` 		= A round is active in guessing phase
 * - `"final"`		= Players are guessing their own
 * - `"finish"` 	= The game has finished
 */
type GameStatus = import("./schemas/gameStateSchema").GameStateSchema["status"];
