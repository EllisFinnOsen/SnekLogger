import { configureStore } from "@reduxjs/toolkit";
import petsSlice from "./petsSlice";
import feedingsSlice from "./feedingsSlice";

export const store = configureStore({
  reducer: {
    pets: petsSlice,
    feedings: feedingsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
