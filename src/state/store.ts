import { createStore } from "redux";
import { rootReducer, initialState } from "./reducers";

export const store = createStore(
  rootReducer, // root reducer
  initialState // our initialState
);