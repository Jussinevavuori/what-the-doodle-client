import "./BrushSelector.scss";
import cx from "classnames"
import { useBrushSelectorController } from "./useBrushSelectorController"
import { Icon } from "@material-ui/core"
import { Brush as BrushIcon, FormatColorFill as FillIcon, Delete as DeleteIcon } from "@material-ui/icons"
import { Color } from "../../lib/drawing/Color";
import { useIsMobile } from "../../hooks/utils/useIsMobile";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";

export type BrushSelectorProps = {
	locked?: boolean;
}

export function BrushSelector(props: BrushSelectorProps) {
	const controller = useBrushSelectorController(props)
	const isMobile = useIsMobile();

	return <div className={cx("BrushSelector", { locked: props.locked })}>

		{
			isMobile
				? <>
					<div className="speedDials">
						<SpeedDial
							hidden={props.locked}
							ariaLabel="brushselector"
							open={controller.brushTypeSelectorState.isOpen}
							onOpen={controller.brushTypeSelectorState.handleOpen}
							onClose={controller.brushTypeSelectorState.handleClose}
							direction="up"
							icon={(() => {
								switch (controller.selectedBrushType) {
									case "brush": return <BrushIcon />;
									case "erase": return <Icon className="eraserIcon">smart_button</Icon>;
									case "fill": return <FillIcon className="fillIcon" />;
								}
							})()}
						>
							<SpeedDialAction
								onClick={controller.handleSelectBrush}
								icon={<BrushIcon />}
								tooltipTitle="Brush"
							/>
							<SpeedDialAction
								onClick={controller.handleSelectFill}
								icon={<FillIcon className="fillIcon" />}
								tooltipTitle="Fill"
							/>
							<SpeedDialAction
								onClick={controller.handleSelectEraser}
								icon={<Icon className="eraserIcon">smart_button</Icon>}
								tooltipTitle="Eraser"
							/>
							<SpeedDialAction
								onClick={controller.handleClear}
								icon={<DeleteIcon />}
								tooltipTitle="Clear"
							/>
						</SpeedDial>

						<SpeedDial
							hidden={props.locked}
							className="colorSpeedDial"
							ariaLabel="colorselector"
							open={controller.brushColorSelectorState.isOpen}
							onOpen={controller.brushColorSelectorState.handleOpen}
							onClose={controller.brushColorSelectorState.handleClose}
							direction="up"
							icon={<span
								className="colorIndicator main"
								style={{ background: controller.selectedColor.toHexString() }}
							/>}
						>
							{
								controller.availableColors.map((color) => (
									<SpeedDialAction
										tooltipTitle="Select"
										key={color.toHexString()}
										onClick={() => controller.handleSelectColor(color)}
										icon={<span
											className="colorIndicator"
											style={{ background: color.toHexString() }}
										/>}
									/>
								))
							}
						</SpeedDial>

						<SpeedDial
							hidden={props.locked}
							ariaLabel="sizeselector"
							open={controller.brushSizeSelectorState.isOpen}
							onOpen={controller.brushSizeSelectorState.handleOpen}
							onClose={controller.brushSizeSelectorState.handleClose}
							direction="up"
							icon={<span
								className="sizeIndicator"
								style={{ width: controller.selectedSize, height: controller.selectedSize }}
							/>}
						>
							{
								controller.availableSizes.map((size) => (
									<SpeedDialAction
										tooltipTitle="Select"
										key={size}
										onClick={() => controller.handleSelectSize(size)}
										icon={<span
											className="sizeIndicator"
											style={{ width: size, height: size }}
										/>}
									/>
								))
							}
						</SpeedDial>
					</div>
				</>
				: <>
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
									<span
										className="sizeIndicator"
										style={{ width: size, height: size }}
									/>
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
				</>
		}
	</div>
}