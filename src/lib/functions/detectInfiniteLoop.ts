let __counters: Record<string, number> = {};
export function detectInfiniteLoop(key: string, cap: number = 10000) {
  if (__counters[key] > cap) {
    throw new Error("Detected infinite loop");
  }
  if (!__counters[key]) {
    __counters[key] = 0;
  }
  __counters[key]++;
}
