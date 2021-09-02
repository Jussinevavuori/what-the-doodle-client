import { clamp } from "./clamp";
import { distance } from "./distance";

/**
 * Finds the nearest edge point in a square with size width*heigth
 */
export function findNearestEdgePoint(
  x: number,
  y: number,
  width: number,
  height: number
): Point {
  const _x = clamp(x, 0, width);
  const _y = clamp(y, 0, height);

  // Check distances to all four candidates:
  // - Candidate 1 is point directly to left on border (0, _y)
  // - Candidate 2 is point directly to right on border (width, _y)
  // - Candidate 3 is point directly to top on border (_x, 0)
  // - Candidate 4 is point directly to bottom on border (_x, height)
  const c1 = distance(_x, _y, 0, _y);
  const c2 = distance(_x, _y, width, _y);
  const c3 = distance(_x, _y, _x, 0);
  const c4 = distance(_x, _y, _x, height);

  // Get minimum distance
  const cMin = Math.min(c1, c2, c3, c4);

  // Check which candidate is nearest and return it
  if (cMin === c1) return { x: 0, y: _y };
  else if (cMin === c2) return { x: width, y: _y };
  else if (cMin === c3) return { x: _x, y: 0 };
  else return { x: _x, y: height };
}
