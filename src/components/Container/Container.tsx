import "./Container.scss";
import cx from "classnames"

export type ContainerProps = {
	children?: React.ReactNode;
	className?: string;
	divProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

export function Container(props: ContainerProps) {
	return <div
		{...props.divProps}
		className={cx(props.divProps?.className, props.className, "Container")}
		children={props.children}
	/>
}