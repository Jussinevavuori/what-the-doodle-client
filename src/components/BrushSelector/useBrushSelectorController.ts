import { useCallback, useRef } from "react";
import { useBrush } from "../../hooks/game/useBrush";
import { Brush } from "../../lib/drawing/Brush";
import { Color } from "../../lib/drawing/Color";
import { BrushSelectorProps } from "./BrushSelector";

export function useBrushSelectorController(props: BrushSelectorProps) {
  const [brush, setBrush] = useBrush();

  const lastSelectedColor = useRef<Color>(Brush.DefaultBrush.color);

  const handleSelectSize = useCallback(
    (size: number) => {
      setBrush(new Brush({ size, color: brush.color, type: brush.type }));
    },
    [brush, setBrush]
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
    },
    [brush, setBrush]
  );

  const handleSelectBrush = useCallback(() => {
    setBrush(
      new Brush({
        size: brush.size,
        color: brush.type === "erase" ? lastSelectedColor.current : brush.color,
        type: "brush",
      })
    );
  }, [brush, setBrush]);

  const handleSelectEraser = useCallback(() => {
    setBrush(Brush.Eraser(brush.size));
  }, [brush, setBrush]);

  const handleSelectFill = useCallback(() => {
    setBrush(new Brush({ size: brush.size, color: brush.color, type: "fill" }));
  }, [brush, setBrush]);

  const handleClear = useCallback(() => {}, []);

  return {
    selectedColor: brush.color,
    selectedSize: brush.size,
    selectedBrushType: brush.type,
    availableSizes: Brush.DefaultSizes,
    availableColors: Brush.DefaultColors,
    handleSelectSize,
    handleSelectColor,
    handleSelectBrush,
    handleSelectEraser,
    handleSelectFill,
    handleClear,
  };
}
