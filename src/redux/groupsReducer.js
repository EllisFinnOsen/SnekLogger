// groupsReducer.js
import {
  FETCH_GROUPS,
  FETCH_GROUP_PETS,
  ADD_PET_TO_GROUP,
  FETCH_GROUPS_FOR_PETS, // New action type
} from "./actionTypes";

const initialState = {
  groups: [],
  // groupPets: mapping of groupId to an array of pet objects
  groupPets: {},
  // petGroups: mapping of petId to an array of group objects
  petGroups: {},
};

export default function groupsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_GROUPS:
      return {
        ...state,
        groups: action.payload, // payload is an array of group objects
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
      // This case is used when a pet is linked to a group.
      // In our updated implementation, we rely on re-fetching with FETCH_GROUP_PETS.
      return state;
    }

    case FETCH_GROUPS_FOR_PETS: {
      const { petId, groups } = action.payload;
      return {
        ...state,
        petGroups: {
          ...state.petGroups,
          [petId]: groups,
        },
      };
    }

    default:
      return state;
  }
}
