import { useCallback, useEffect, useRef } from "react";
import { useBrush } from "../../hooks/game/useBrush";
import { useOpenState } from "../../hooks/utils/useOpenState";
import { Brush } from "../../lib/drawing/Brush";
import { Color } from "../../lib/drawing/Color";
import { BrushSelectorProps } from "./BrushSelector";

export function useBrushSelectorController(props: BrushSelectorProps) {
  const [brush, setBrush] = useBrush();

  const lastSelectedBrush = useRef<Brush | null>(null);
  const lastSelectedColor = useRef<Color>(Brush.DefaultBrush.color);

  const brushTypeSelectorState = useOpenState();
  const brushSizeSelectorState = useOpenState();
  const brushColorSelectorState = useOpenState();

  const closeBrushTypeSelector = brushTypeSelectorState.handleClose;
  const closeBrushSizeSelector = brushSizeSelectorState.handleClose;
  const closeBrushColorSelector = brushColorSelectorState.handleClose;
  const resetStates = useCallback(() => {
    closeBrushTypeSelector();
    closeBrushSizeSelector();
    closeBrushColorSelector();
  }, [closeBrushColorSelector, closeBrushTypeSelector, closeBrushSizeSelector]);

  // Memorize last selected brush and automatically clear canvasclear brush
  // selection to last selected brush
  useEffect(() => {
    if (brush === Brush.CanvasClear) {
      setBrush(lastSelectedBrush.current ?? Brush.DefaultBrush);
    } else {
      lastSelectedBrush.current = brush;
    }
  }, [lastSelectedBrush, brush, setBrush]);

  const handleSelectSize = useCallback(
    (size: number) => {
      setBrush(new Brush({ size, color: brush.color, type: brush.type }));
      resetStates();
    },
    [brush, setBrush, resetStates]
  );

  const handleSelectColor = useCallback(
    (color: Color) => {
      lastSelectedColor.current = color;
      switch (brush.type) {
        case "erase": {
          setBrush(new Brush({ size: brush.size, color, type: "brush" }));
          break;
        }
        default: {
          setBrush(
            new Brush({
              size: brush.size,
              color,
              type: brush.type,
            })
          );
          break;
        }
      }
      resetStates();
    },
    [brush, setBrush, resetStates]
  );

  const handleSelectBrush = useCallback(() => {
    setBrush(
      new Brush({
        size: brush.size,
        color: brush.type === "erase" ? lastSelectedColor.current : brush.color,
        type: "brush",
      })
    );
    resetStates();
  }, [brush, setBrush, resetStates]);

  const handleSelectEraser = useCallback(() => {
    setBrush(Brush.Eraser(brush.size));
    resetStates();
  }, [brush, setBrush, resetStates]);

  const handleSelectFill = useCallback(() => {
    setBrush(new Brush({ size: brush.size, color: brush.color, type: "fill" }));
    resetStates();
  }, [brush, setBrush, resetStates]);

  const handleClear = useCallback(() => {
    setBrush(Brush.CanvasClear);
    resetStates();
  }, [setBrush, resetStates]);

  return {
    selectedColor: brush.color,
    selectedSize: brush.size,
    selectedBrushType: brush.type,
    availableSizes: Brush.DefaultSizes,
    availableColors: Brush.DefaultColors,
    brushTypeSelectorState,
    brushSizeSelectorState,
    brushColorSelectorState,
    handleSelectSize,
    handleSelectColor,
    handleSelectBrush,
    handleSelectEraser,
    handleSelectFill,
    handleClear,
  };
}
