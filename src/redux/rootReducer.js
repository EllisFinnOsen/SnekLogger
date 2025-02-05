import { combineReducers } from "@reduxjs/toolkit";
import petsReducer from "./petsReducer";
import feedingsReducer from "./feedingsReducer";
import groupsReducer from "./groupsReducer";
import groupPetsReducer from "./groupPetReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  pets: petsReducer,
  feedings: feedingsReducer,
  groups: groupsReducer,
  groupPets: groupPetsReducer,
  user: userReducer,
});

export default rootReducer;
