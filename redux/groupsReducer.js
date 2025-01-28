import { FETCH_GROUPS } from './actionTypes';

const initialState = [];

export default function groupsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_GROUPS:
      return action.payload;
    default:
      return state;
  }
}