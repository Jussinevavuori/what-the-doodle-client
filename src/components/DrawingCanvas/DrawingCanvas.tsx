import "./DrawingCanvas.scss";
import { useDrawingCanvasController } from "./useDrawingCanvasController"

export type DrawingCanvasProps = {}

export function DrawingCanvas(props: DrawingCanvasProps) {
	const controller = useDrawingCanvasController({});

	return <div className="DrawingCanvas">
		<header>
			<textarea
				value={controller.currentRound?.topic}
				disabled
			/>
		</header>
		<canvas
			style={{ aspectRatio: `${controller.width}/${controller.height}` }}
			width={controller.width}
			height={controller.height}
			ref={controller.canvasRef}
		/>
	</div>
}