import "./BrushSelector.scss";
import cx from "classnames"
import { useBrushSelectorController } from "./useBrushSelectorController"
import { Icon } from "@material-ui/core"
import { Brush as BrushIcon, FormatColorFill as FillIcon, Delete as DeleteIcon } from "@material-ui/icons"
import { Color } from "../../lib/drawing/Color";

export type BrushSelectorProps = {
	locked?: boolean;
}

export function BrushSelector(props: BrushSelectorProps) {

	const controller = useBrushSelectorController(props)

	return <div className={cx("BrushSelector", { locked: props.locked })}>
		<ul className="sizes">
			{
				controller.availableSizes.map((size) => (
					<button
						className={cx("brush", "size", {
							selected: size === controller.selectedSize
								&& controller.selectedBrushType !== "fill"
								&& !props.locked
						})}
						key={size}
						onClick={() => controller.handleSelectSize(size)}
					>
						<span style={{ width: size, height: size }} />
					</button>
				))
			}
		</ul>
		<ul className="colors">
			{
				controller.availableColors.map((color) => (
					<button
						className={cx("brush", "color", {
							selected: color.equals(controller.selectedColor)
								&& controller.selectedBrushType !== "erase"
								&& !props.locked,
							isWhite: color.equals(Color.White),
						})}
						key={color.toHexString()}
						onClick={() => controller.handleSelectColor(color)}
						style={{ background: color.toHexString() }}
					/>
				))
			}
		</ul>
		<ul className="utils">
			<button
				className={cx("tool", "draw", {
					selected: controller.selectedBrushType === "brush" && !props.locked
				})}
				onClick={controller.handleSelectBrush}
			>
				<BrushIcon />
			</button>
			<button
				className={cx("tool", "fill", {
					selected: controller.selectedBrushType === "fill" && !props.locked
				})}
				onClick={controller.handleSelectFill}
			>
				<FillIcon className="fillIcon" />
			</button>
			<button
				className={cx("tool", "erase", {
					selected: controller.selectedBrushType === "erase" && !props.locked
				})}
				onClick={controller.handleSelectEraser}
			>
				<Icon className="eraserIcon">smart_button</Icon>
			</button>
			<button
				className="tool clear"
				onClick={controller.handleClear}
			>
				<DeleteIcon />
			</button>
		</ul>
	</div>
}