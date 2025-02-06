// groupsReducer.js
import {
  FETCH_GROUPS,
  FETCH_GROUP_PETS,
  ADD_PET_TO_GROUP,
  FETCH_GROUPS_FOR_PETS,
  REMOVE_PET_FROM_GROUP,
  ADD_GROUP,
  DELETE_GROUP,
  UPDATE_GROUP,
} from "../actions/actionTypes";

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

    case REMOVE_PET_FROM_GROUP: {
      const { groupId, petId } = action.payload;
      const currentGroupPets = state.groupPets[groupId] || [];
      return {
        ...state,
        groupPets: {
          ...state.groupPets,
          [groupId]: currentGroupPets.filter((pet) => pet.id !== petId),
        },
      };
    }

    // In groupsReducer.js, add a new case:
    case ADD_GROUP: {
      return {
        ...state,
        groups: [...state.groups, action.payload],
      };
    }

    case UPDATE_GROUP: {
      const updatedGroup = action.payload;
      return {
        ...state,
        groups: state.groups.map((g) =>
          g.id === updatedGroup.id ? updatedGroup : g
        ),
      };
    }
    case DELETE_GROUP: {
      const groupId = action.payload;
      return {
        ...state,
        groups: state.groups.filter((g) => g.id !== groupId),
        // Optionally remove groupPets if needed:
        groupPets: Object.keys(state.groupPets).reduce((acc, key) => {
          if (Number(key) !== groupId) {
            acc[key] = state.groupPets[key];
          }
          return acc;
        }, {}),
      };
    }

    default:
      return state;
  }
}
