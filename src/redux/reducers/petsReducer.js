import {
  FETCH_PETS,
  FETCH_FEEDINGS,
  UPDATE_FEEDING,
  FETCH_PET,
  UPDATE_PET,
  ADD_PET,
  DELETE_PET,
} from "../actions/actionTypes";

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
          feeding.id === action.payload.id
            ? { ...feeding, ...action.payload }
            : feeding
        ),
      };

    case UPDATE_PET:
      return {
        ...state,
        pets: state.pets.map((pet) =>
          pet.id === action.payload.id ? { ...pet, ...action.payload } : pet
        ),
      };
    case ADD_PET:
      return {
        ...state,
        pets: [...state.pets, action.payload],
      };
    // In petsReducer.js, inside the switch:
    case DELETE_PET:
      return {
        ...state,
        pets: state.pets.filter((pet) => pet.id !== action.payload),
        feedings: state.feedings.filter(
          (feeding) => feeding.petId !== action.payload
        ),
      };

    default:
      return state;
  }
}
