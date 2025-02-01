// groupPetsReducer.js
import { FETCH_GROUP_PETS } from "./actionTypes";

const initialGroupPetsState = {};

export default function groupPetsReducer(
  state = initialGroupPetsState,
  action
) {
  switch (action.type) {
    case FETCH_GROUP_PETS:
      return {
        ...state,
        [action.payload.groupId]: action.payload.pets,
      };
    default:
      return state;
  }
}
