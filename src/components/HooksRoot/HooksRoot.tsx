import { useClearSockets } from "../../hooks/sockets/clearSockets";
import { useSocketErrors } from "../../hooks/sockets/useSocketErrors";
import { useVhFix } from "../../hooks/utils/useVhFix";

export function HooksRoot() {
	useVhFix();
	useSocketErrors();
	useClearSockets();

	return null;
}