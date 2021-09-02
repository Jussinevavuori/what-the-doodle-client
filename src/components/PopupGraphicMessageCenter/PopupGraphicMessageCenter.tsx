import "./PopupGraphicMessageCenter.scss";
import React from "react";
import { usePopupGraphicMessageCenterController } from "./usePopupGraphicMessageCenterController";
import { PopupGraphicMessage } from "../PopupGraphicMessage/PopupGraphicMessage";

export type PopupGraphicMessageCenterProps = {

};

export function PopupGraphicMessageCenter(props: PopupGraphicMessageCenterProps) {

	const controller = usePopupGraphicMessageCenterController(props)

	return <>
		{
			controller.messages.map(msg => <PopupGraphicMessage message={msg} key={msg.id} />)
		}
	</>

}