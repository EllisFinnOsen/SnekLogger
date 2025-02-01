// groupsReducer.js
import { FETCH_GROUPS } from "./actionTypes";

const initialGroupsState = [];

export default function groupsReducer(state = initialGroupsState, action) {
  switch (action.type) {
    case FETCH_GROUPS:
      return action.payload;
    default:
      return state;
  }
}
