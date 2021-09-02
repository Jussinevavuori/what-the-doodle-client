import { createStore, createTypedHooks } from "easy-peasy";
import { gameModel, GameModel } from "./models/GameModel";

export interface StoreModel {
  game: GameModel;
}

export const storeModel: StoreModel = {
  game: gameModel,
};

export const store = createStore(storeModel, {
  name: "Main store",
  devTools: process.env.NODE_ENV !== "production",
});

export const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
export const useStore = typedHooks.useStore;

(window as any).store = store;
(window as any).g = () => store.getState().game;
