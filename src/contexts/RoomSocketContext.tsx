import { createContext, useContext, useEffect } from "react"
import { useRoomSocket } from "../hooks/sockets/useRoomSocket";
import { RoomSocket } from "../lib/sockets/RoomSocket";

export type RoomSocketContextType = RoomSocket | undefined;

export const RoomSocketContext = createContext<RoomSocketContextType>(undefined)

export function useRoomSocketContext() {
	return useContext(RoomSocketContext);
}

export function RoomSocketContextProvider(props: { children?: React.ReactNode }) {
	const socket = useRoomSocket();
	useEffect(() => {
		if (socket) {
			return socket.connect();
		}
	}, [socket]);

	return <RoomSocketContext.Provider value={socket} {...props} />
}