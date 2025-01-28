import { combineReducers } from '@reduxjs/toolkit';
import petsReducer from './petsReducer';
import feedingsReducer from './feedingsReducer';

const rootReducer = combineReducers({
  pets: petsReducer,
  feedings: feedingsReducer,
});

export default rootReducer;
