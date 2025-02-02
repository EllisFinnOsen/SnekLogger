// groupsReducer.js
import {
  FETCH_GROUPS,
  FETCH_GROUP_PETS,
  ADD_PET_TO_GROUP,
} from "./actionTypes";

const initialState = {
  groups: [],
  // groupPets: { groupId: [ petObject, ... ] }
  groupPets: {},
};

export default function groupsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_GROUPS:
      return {
        ...state,
        groups: action.payload, // payload should be an array of group objects
      };

    case FETCH_GROUP_PETS: {
      const { groupId, pets } = action.payload;
      return {
        ...state,
        groupPets: {
          ...state.groupPets,
          [groupId]: pets,
        },
      };
    }

    case ADD_PET_TO_GROUP: {
      // Option 1: Re-fetch the group's pets in your action after adding.
      // Option 2: If the action provides the full pet object, append it.
      // For example, if action.payload.pet contains the full pet object:
      const { groupId, petId } = action.payload; // note: pet, not petId
      const currentGroupPets = state.groupPets[groupId] || [];
      return {
        ...state,
        groupPets: {
          ...state.groupPets,
          [groupId]: [...currentGroupPets, petId],
        },
      };
    }

    default:
      return state;
  }
}
