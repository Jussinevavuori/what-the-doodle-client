import { RouteData } from "./lib/route/RouteData";

export const Routes = {
  home: new RouteData<{}>({
    path: "/",
    title: "Home",
    variables: [],
  }),
  room: new RouteData<{ roomId: string }>({
    path: "/r/:roomId",
    title: "Game",
    variables: ["roomId"],
  }),
};
