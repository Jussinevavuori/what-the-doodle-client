import { SvgCornerPiecePath } from "./SvgCornerPiecePath";
import { SvgPartialCirclePath } from "./SvgPartialCirclePath";

export class SvgPath {
  /**
   * Describes a partial circle path using the `SvgPartialCirclePath` class.
   */
  static describePartialCirclePath = SvgPartialCirclePath.describe;

  /**
   * Describes a corner piece path using the `SvgCornerPiecePath` class.
   */
  static describeCornerPiecePath = SvgCornerPiecePath.describe;
}
