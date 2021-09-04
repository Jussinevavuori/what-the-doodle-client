import { useEffect, useState, useCallback, useMemo } from "react";

export function useMedia(query: string) {
  /**
   * Media query list from query
   */
  const mediaQueryList = useMemo(() => {
    return window.matchMedia(query);
  }, [query]);

  /**
   * Current value
   */
  const [value, setValue] = useState<boolean>(false);

  /**
   * Changehandler: sets the current value
   */
  const changeHandler = useCallback(() => {
    setValue(mediaQueryList.matches);
  }, [mediaQueryList]);

  /**
   * Listening to changes and cleanup
   */
  useEffect(() => {
    changeHandler();
    mediaQueryList.addEventListener("change", changeHandler);
    return () => {
      mediaQueryList.removeEventListener("change", changeHandler);
    };
  }, [mediaQueryList, changeHandler]);

  /**
   * Returning value
   */
  return value;
}
