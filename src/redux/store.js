import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      (store) => (next) => (action) => {
        console.log("Dispatching action:", action);
        const result = next(action);
        console.log("Updated state:", store.getState());
        return result;
      }
    ),
});

export default store;
