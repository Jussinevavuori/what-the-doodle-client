import "./PlayerBottomList.scss";
import React from "react";
import cx from "classnames";
import { usePlayerBottomListController } from "./usePlayerBottomListController";
import { PlayerAvatar } from "../PlayerAvatar/PlayerAvatar";

export type PlayerBottomListProps = {

};

export function PlayerBottomList(props: PlayerBottomListProps) {

	const controller = usePlayerBottomListController(props)

	return <div className={cx("PlayerBottomList")}>

		<ul className="myList">
			<li className="me">
				<PlayerAvatar player={controller.myPlayer} />
			</li>
		</ul>

		<ul>
			{
				controller.otherPlayers.sort((a, b) => a.id.localeCompare(b.id)).map(p => (
					<li key={p.id}>
						<PlayerAvatar player={p} />
					</li>
				))
			}
		</ul>

	</div>

}