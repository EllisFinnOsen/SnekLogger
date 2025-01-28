import { combineReducers } from '@reduxjs/toolkit';
import petsReducer from './petsReducer';
import feedingsReducer from './feedingsReducer';
import groupsReducer from './groupsReducer';
import groupPetsReducer from './groupPetReducer';


const rootReducer = combineReducers({
  pets: petsReducer,
  feedings: feedingsReducer,
  groups: groupsReducer,
  groupPets: groupPetsReducer,
});

export default rootReducer;