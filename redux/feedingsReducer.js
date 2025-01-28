import { FETCH_FEEDINGS, UPDATE_FEEDING } from './actionTypes';

const initialState = [];

export default function feedingsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FEEDINGS:
  // Replace any existing feedings for this pet with the new ones
  const newFeedings = action.payload;

  // Identify the petId from the newly fetched feedings
  // (Assumes all feedings in action.payload share the same petId)
  const petId = newFeedings.length ? newFeedings[0].petId : null;

  // Filter out old feedings for this pet, then append the new feedings
  const filteredOld = state.filter((oldFeeding) => oldFeeding.petId !== petId);
  return [...filteredOld, ...newFeedings];

    case UPDATE_FEEDING:
      return state.map((feeding) =>
        feeding.id === action.payload.id ? action.payload : feeding
      );
    default:
      return state;
  }
}
