/**
 * Linearly interpolates a value from a to b based on the time argument t
 * between 0 and 1. For example, t=0 would return a, t=1 would return b and
 * t=0.5 would return the average of a and b.
 *
 * @param a Starting value (return value when t = 0)
 * @param b Target value (return value when t = 1)
 * @param t Value between 0 and 1
 */
export function lerp(a: number, b: number, t: number) {
  return a * (1 - t) + b * t;
}
