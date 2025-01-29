import { FETCH_PETS, FETCH_FEEDINGS, UPDATE_FEEDING } from './actionTypes';

const initialState = {
  pets: [],
  feedings: [],
};

export default function petsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PETS:
      return { ...state, pets: action.payload };
      case FETCH_FEEDINGS:
        return {
          ...state,
          feedings: [...state.feedings, ...action.payload], // Append new feedings
        };
      
    case UPDATE_FEEDING:
      return {
        ...state,
        feedings: state.feedings.map((feeding) =>
          feeding.id === action.payload.id ? { ...feeding, ...action.payload } : feeding
        ),
      };
    default:
      return state;
  }
}
