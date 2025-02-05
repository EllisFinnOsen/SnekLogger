import { combineReducers } from "@reduxjs/toolkit";
import petsReducer from "./petsReducer";
import feedingsReducer from "./feedingsReducer";
import groupsReducer from "./groupsReducer";
import groupPetsReducer from "./groupPetReducer";
import userReducer from "./userReducer";
import freezerReducer from "./freezerReducer";
import feedingFreezerReducer from "./feedingFreezerReducer";

const rootReducer = combineReducers({
  pets: petsReducer,
  feedings: feedingsReducer,
  freezer: freezerReducer,
  feedingFreezer: feedingFreezerReducer,
  groups: groupsReducer,
  groupPets: groupPetsReducer,
  user: userReducer,
});

export default rootReducer;
