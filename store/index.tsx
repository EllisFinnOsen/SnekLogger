import { configureStore } from "@reduxjs/toolkit";
import feedingsReducer from "./feedingsSlice";

const store = configureStore({
  reducer: {
    feedings: feedingsReducer,
  },
});

console.log("configureStore 'const store' from store/index:", store);
console.log("Reducers in store:", store.getState());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
