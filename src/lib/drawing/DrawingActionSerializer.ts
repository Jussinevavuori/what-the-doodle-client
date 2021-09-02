import { Brush } from "./Brush";
import { ClearDrawingAction } from "./ClearDrawingAction";
import { Color } from "./Color";
import { DrawDrawingAction } from "./DrawDrawingAction";
import { FillDrawingAction } from "./FillDrawingAction";

export class DrawingActionSerializer {
  /**
   * Separator character for when multiple actions are serialized
   * together
   */
  private static separator = "!";

  /**
   * Serializes a single drawing action into a string containing
   * all data about that action.
   */
  static serializeOne(action: DrawingAction): string {
    // Brush serial preconstructed
    const brush = `${action.brush.size}/${action.brush.color.toHexString()}`;

    // Serialize a draw action in the format
    // D?{brushSize}/{brushColor}@{p0x};{p0y}+{p1x};{p1y};...
    if (action.isDrawAction()) {
      const coords = action.coordinates
        .map((c) => `${c.x.toString(16)};${c.y.toString(16)}`)
        .join("+");
      return `D?${brush}@${coords}`;
    }

    // Serialize a fill action in the format
    // F?{brushSize}/{brushColor}@{originX};{originY}
    if (action.isFillAction()) {
      const xStr = action.origin.x.toString(16);
      const yStr = action.origin.y.toString(16);
      return `F?${brush}@${xStr};${yStr}`;
    }

    // Serialize a clear action in the format
    // C?{brushSize}/{brushColor}@
    if (action.isClearAction()) {
      return `C?${brush}@`;
    }

    // Should never come here, just in case return empty string
    return "";
  }

  /**
   * Serializes multiple drawing actions into one string
   */
  static serializeMany(actions: DrawingAction[]): string {
    return actions
      .map((x) => DrawingActionSerializer.serializeOne(x))
      .join(DrawingActionSerializer.separator);
  }

  /**
   * Parses a brush from an action serial
   */
  private static parseBrush(serial: string): Brush {
    // Brush data is located between the "?" and "@" characters
    const startSep = serial.indexOf("?");
    const endSep = serial.indexOf("@");

    // If characters not found, return default brush
    if (startSep < 0 || endSep < 0) {
      return Brush.DefaultBrush;
    }

    // Parse size and color from brush
    const brushSerial = serial.substring(startSep + 1, endSep);
    const [sizeSerial, colorSerial] = brushSerial.split("/");
    const size = parseInt(sizeSerial);
    const color = Color.fromHexString(colorSerial);

    // Parse type
    const type = serial.charAt(0) === "F" ? "fill" : "brush";

    // Validate size and color
    if (Number.isSafeInteger(size) && size > 0 && color.isValid()) {
      return new Brush({ size, color, type });
    }

    // On invalid data return default brush
    return Brush.DefaultBrush;
  }

  /**
   * Parses coordinates from an action serial
   */
  private static parseCoordinates(serial: string): Point[] {
    // Coordinates are located at end of string after "@"
    const coordinateStr = serial.split("@")[1];
    if (!coordinateStr) {
      return [];
    }

    // Parse each pair of coordinates (separated by "+")
    // where the x and y coordinates are separated by ";"
    // and stored in hex
    return coordinateStr.split("+").map((coordPair) => {
      const [xHex, yHex] = coordPair.split(";");
      return {
        x: parseInt(xHex, 16),
        y: parseInt(yHex, 16),
      };
    });
  }

  /**
   * Parses a drawing action serial into a drawing action. This should
   * not be used publically as we cannot assume a serial only contains
   * one action. Used primarily by the parse method.
   */
  private static parseOne(serial: string): DrawingAction {
    // Parse common components
    const brush = DrawingActionSerializer.parseBrush(serial);
    const coords = DrawingActionSerializer.parseCoordinates(serial);

    // Act based on which action is specified by the first character
    switch (serial.charAt(0)) {
      // Draw drawing action
      case "D": {
        return new DrawDrawingAction("server", brush).addCoordinates(coords);
      }

      // Fill drawing action
      case "F": {
        if (coords[0]) {
          return new FillDrawingAction("server", brush, coords[0]);
        }
        break;
      }

      // Clear drawing action
      case "C": {
        return new ClearDrawingAction("server", brush);
      }
    }

    // In case of error, return empty drawing action
    return new DrawDrawingAction("server", brush);
  }

  /**
   * Parses a serialized string of drawing actions into separate drawing actions
   */
  static parse(serial: string): DrawingAction[] {
    return serial
      .split(DrawingActionSerializer.separator)
      .map((s) => DrawingActionSerializer.parseOne(s));
  }
}
