import { useMedia } from "./useMedia";

/**
 * (min-width: $px) media query hook wrapper
 */
export function useMinWidthMedia(minWidth: number) {
  const query = `(min-width: ${minWidth}px)`;
  return useMedia(query);
}
