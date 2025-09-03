import { configureStore } from "@reduxjs/toolkit";
import trips from "./trips.slice";
export const store = configureStore({ reducer: { trips }});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
