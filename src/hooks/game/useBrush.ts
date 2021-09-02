import { ActionCreator } from "easy-peasy";
import { useMemo } from "react";
import { Brush } from "../../lib/drawing/Brush";
import { useStoreActions, useStoreState } from "../../store";

export function useBrush(): [Brush, ActionCreator<Brush>] {
  const brush = useStoreState((_) => _.game.brush);
  const setBrush = useStoreActions((_) => _.game.setBrush);

  return useMemo(() => [brush, setBrush], [brush, setBrush]);
}
