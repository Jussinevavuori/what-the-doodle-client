import { scssTheme } from "../../styles/scssVariables";
import { useMaxWidthMedia } from "./useMaxWidthMedia";

export function useIsMobile() {
  return useMaxWidthMedia(
    Number.parseInt(scssTheme.bp_md.replace(/\D/, "")) - 1
  );
}
