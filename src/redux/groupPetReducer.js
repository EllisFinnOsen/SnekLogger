import { FETCH_GROUP_PETS } from './actionTypes';

const initialState = [];

export default function groupPetsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_GROUP_PETS:
      return action.payload;
    default:
      return state;
  }
}