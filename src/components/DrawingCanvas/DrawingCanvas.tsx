import { Type } from "../Type/Type";
import "./DrawingCanvas.scss";
import { useDrawingCanvasController } from "./useDrawingCanvasController"

export type DrawingCanvasProps = {}

export function DrawingCanvas(props: DrawingCanvasProps) {
	const controller = useDrawingCanvasController({});

	return <div className="DrawingCanvas">
		<header>
			<Type
				className="topic"
				color="white"
				size="lg"
			>
				{controller.currentRound?.topic}
			</Type>
		</header>
		<canvas
			style={{ aspectRatio: `${controller.width}/${controller.height}` }}
			width={controller.width}
			height={controller.height}
			ref={controller.canvasRef}
		/>
	</div>
}