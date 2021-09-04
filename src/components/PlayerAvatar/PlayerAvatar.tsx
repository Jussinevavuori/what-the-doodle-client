import "./PlayerAvatar.scss";
import cx from "classnames";
import { Type } from "../Type/Type";
import { User } from "../../lib/auth/User";

export type PlayerAvatarProps = {
	player: User;
	hideNametag?: boolean;
	size?: number;
};

export function PlayerAvatar(props: PlayerAvatarProps) {

	return <div
		className={cx("PlayerAvatar", {
			isOnline: props.player.isOnline,
			isSelf: props.player.isSelf,
		})}
		style={{
			width: props.size ?? PlayerAvatarDefaults.size
		}}
	>
		{
			!props.hideNametag &&
			<Type className="nametag" component="span">{props.player.name}</Type>
		}
		<img className="image" alt="Avatar" src={props.player.avatarUrl} />
	</div>

}

export const PlayerAvatarDefaults = {
	size: 60,
}