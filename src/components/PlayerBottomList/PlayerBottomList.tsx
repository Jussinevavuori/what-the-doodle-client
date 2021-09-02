import "./PlayerBottomList.scss";
import React from "react";
import cx from "classnames";
import { usePlayerBottomListController } from "./usePlayerBottomListController";

export type PlayerBottomListProps = {

};

export function PlayerBottomList(props: PlayerBottomListProps) {

	const controller = usePlayerBottomListController(props)

	return <div className={cx("PlayerBottomList")}>

		<ul className="myList">
			<li className={cx("me", { isOnline: controller.myPlayer.isOnline })}>
				<span>{controller.myPlayer.name}</span>
				<img alt="My avatar" src={controller.myPlayer.avatarUrl} />
			</li>
		</ul>

		<ul>
			{
				controller.otherPlayers.map(p => (
					<li key={p.id} className={cx({ isOnline: p.isOnline })}>
						<span>{p.name}</span>
						<img alt={`${p.name}'s avatar`} src={p.avatarUrl} />
					</li>
				))
			}
		</ul>

	</div>

}