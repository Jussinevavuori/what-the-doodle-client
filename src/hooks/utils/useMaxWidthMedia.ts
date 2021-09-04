import { useMedia } from "./useMedia";

/**
 * (max-width: $px) media query hook wrapper
 */
export function useMaxWidthMedia(maxWidth: number) {
  const query = `(max-width: ${maxWidth}px)`;
  return useMedia(query);
}
