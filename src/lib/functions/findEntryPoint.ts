import { clamp } from "./clamp";

/**
 * Given a location x, y which was moved to from the last position by
 * dx, dy in a w * h rectangle, find the entry point assuming
 * the position moved in a straight line. Clamp the x, y point to be within
 * the rectangle.
 *
 * @param x	 Current X location
 * @param y  Current Y position
 * @param dx Previous movement in X direction
 * @param dy Previous movement in Y direction
 * @param w	 Rectangle's width
 * @param h	 Rectangle's height
 */
export function findEntryPoint(
  x: number,
  y: number,
  dx: number,
  dy: number,
  w: number,
  h: number
) {
  // In case no movement, return (-1, -1) to signal failure
  if (dx === 0 && dy === 0) {
    return { x: -1, y: -1 };
  }

  // Clamp coordinates
  const _x = clamp(x, 0, w);
  const _y = clamp(y, 0, h);

  // Distances to horizontal (h) and vertical (v) edges. Which vertical
  // or horizontal edge is chosen depends on the direction of movement.
  // If no movement towards either edge, distance to any edge in that
  // direction is infinite
  const dv = dy === 0 ? Infinity : dy > 0 ? y : h - y;
  const dh = dx === 0 ? Infinity : dx > 0 ? x : w - x;

  // Check how many movements of dx,dy are required to reach each edge
  const ndv = dv === Infinity ? Infinity : dv / Math.abs(dy);
  const ndh = dh === Infinity ? Infinity : dh / Math.abs(dx);

  // min(ndv, ndh) movements are required to reach the nearest edge
  const nd = Math.min(ndv, ndh);

  // Return point when moving from x,y by nd times dy,dx. The resulting
  // point should be at the edge
  return {
    x: clamp(_x - dx * nd, 0, w),
    y: clamp(_y - dy * nd, 0, h),
  };
}
