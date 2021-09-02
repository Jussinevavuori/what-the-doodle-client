export function distanceSquared(
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  const dx = x0 - x1;
  const dy = y0 - y1;
  return dx * dx + dy * dy;
}
