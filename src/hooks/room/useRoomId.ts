import { useMemo } from "react";
import { useRouteMatch } from "react-router";

export function useRoomId() {
  const routeMatch = useRouteMatch<{ roomId?: string }>("/r/:roomId");

  return useMemo(() => {
    return routeMatch?.params.roomId;
  }, [routeMatch]);
}
