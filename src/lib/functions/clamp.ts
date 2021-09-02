/**
 * Clamp a value between two other values inclusive
 */
export function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}
