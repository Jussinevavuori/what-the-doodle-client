export function mapValue(
  val: number,
  aMin: number,
  aMax: number,
  bMin: number,
  bMax: number
) {
  return ((val - aMin) / aMax) * bMax + bMin;
}
