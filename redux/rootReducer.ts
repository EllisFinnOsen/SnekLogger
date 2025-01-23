import { combineReducers } from "@reduxjs/toolkit";
import petsReducer from "./slices/petsSlice";

const rootReducer = combineReducers({
  pets: petsReducer,
  // Add other slice reducers here as you expand your state
});

export default rootReducer;
