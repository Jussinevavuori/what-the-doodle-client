import "./PercentageCircle.scss";
import cx from "classnames";
import { usePercentageCircleController } from "./usePercentageCircleController";
import { Type, TypeProps } from "../Type/Type";
import { Angle } from "../../lib/geometry/Angle";
import { SvgPath } from "../../lib/svg/SvgPath";
import { Color } from "../../lib/drawing/Color";

export type PercentageCircleProps = {
	id?: string;
	/**
	 * Non-negative number. Can go over 100.
	 */
	percentage: number;

	/**
	 * Size (diameter) in px
	 */
	size?: number;

	/**
	 * Replace label tet
	 */
	label?: string;

	/**
	 * Props for the label element
	 */
	labelProps?: TypeProps;

	/**
	 * Class name
	 */
	className?: string;

	/**
	 * Optional background color.
	 */
	backgroundColor?: Color;

	/**
	 * Optional inactive percentage color (color of unfilled part of circle).
	 */
	unfilledColor?: Color;

	/**
	 * Optional active percentage color (color of filled part of circle).
	 */
	filledColor?: Color;
};


export function PercentageCircle(props: PercentageCircleProps) {
	const controller = usePercentageCircleController(props)

	return <div
		id={props.id}
		className={cx(
			"PercentageCircle",
			{ isOverflow: controller.isOverflow },
			props.className
		)}
		style={{ width: 2 * controller.radius, height: 2 * controller.radius }}
	>

		<svg
			height={controller.radius * 2}
			width={controller.radius * 2}
		>
			<circle
				className={cx(
					"background",
					{ isOverflow: controller.isOverflow },
				)}
				style={{
					fill: props.backgroundColor?.toHexString({ omitAlpha: true }) ?? "transparent"
				}}
				cx={controller.radius}
				cy={controller.radius}
				r={controller.radius}
			/>
			<path
				className={cx(
					"inactive",
					{ isOverflow: controller.isOverflow },
				)}
				style={{
					stroke: props.unfilledColor?.toHexString({ omitAlpha: true }) ?? "#83aff4"
				}}
				d={SvgPath.describePartialCirclePath({
					radius: controller.radius,
					offsetAngle: new Angle(0, "percentages"),
					sweepAngle: new Angle(100, "percentages"),
					strokeWidth: 4,
				})}

			/>
			<path
				className={cx(
					"active",
					{ isOverflow: controller.isOverflow },
				)}
				style={{
					stroke: props.filledColor?.toHexString({ omitAlpha: true }) ?? "#2a52e2"
				}}
				ref={controller.activeRef}
				d={SvgPath.describePartialCirclePath({
					radius: controller.radius,
					offsetAngle: new Angle(0, "percentages"),
					sweepAngle: new Angle(controller.fillPercentage, "percentages"),
					strokeWidth: 4,
				})}
			/>
		</svg>

		<Type
			component="label"
			size="sm"
			variant="bold"
			{...props.labelProps}
		>
			{props.label ?? controller.percentage.toFixed(0) + "%"}
		</Type>
	</div>
}