import { combineReducers } from "@reduxjs/toolkit";
import petsReducer from "./petsReducer";
import feedingsReducer from "./feedingsReducer";
import groupsReducer from "./groupsReducer";
import groupPetsReducer from "./groupPetReducer";
import userReducer from "./userReducer";
import freezerReducer from "./freezerReducer";
import feedingFreezerReducer from "./feedingFreezerReducer";
import recurringFeedingsReducer from "./recurringFeedingsReducer";

const rootReducer = combineReducers({
  pets: petsReducer,
  feedings: feedingsReducer,
  recurringFeedings: recurringFeedingsReducer,
  freezer: freezerReducer,
  feedingFreezer: feedingFreezerReducer,
  groups: groupsReducer,
  groupPets: groupPetsReducer,
  user: userReducer,
});

export default rootReducer;
