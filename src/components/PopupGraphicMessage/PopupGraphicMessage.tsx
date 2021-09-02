import "./PopupGraphicMessage.scss";
import React from "react";
import cx from "classnames";
import { PopupGraphicMessageContent } from "../../hooks/utils/usePopupGraphicMessage";
import { usePopupGraphicMessageController } from "./usePopupGraphicMessageController";

export type PopupGraphicMessageProps = {
	message: PopupGraphicMessageContent;
};

export function PopupGraphicMessage(props: PopupGraphicMessageProps) {
	const controller = usePopupGraphicMessageController(props)

	return <div className={cx("PopupGraphicMessage")}>
		<canvas width={600} height={600} ref={controller.canvasRef} />
		<div className="textContent">
			<span className="span-1">{props.message.message}</span>
			<span className="span-2">{props.message.message}</span>
			<span className="span-3">{props.message.message}</span>
		</div>
	</div>
}