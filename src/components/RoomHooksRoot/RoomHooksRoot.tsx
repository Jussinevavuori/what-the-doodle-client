import { useDisplayPopups } from "../../hooks/game/useDisplayPopups";
import { useNotifyConnectionEvents } from "../../hooks/game/useNotifyConnectionEvents";
import { useRequireValidUser } from "../../hooks/game/useRequireValidUser";

export function RoomHooksRoot() {
	useDisplayPopups();
	useRequireValidUser();
	useNotifyConnectionEvents();

	return null;
}