import { FETCH_FEEDINGS, UPDATE_FEEDING, ADD_FEEDING } from "./actionTypes";

const initialState = [];

export default function feedingsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FEEDINGS:
      const newFeedings = action.payload;

      const petId = newFeedings.length ? newFeedings[0].petId : null;

      const filteredOld = state.filter(
        (oldFeeding) => oldFeeding.petId !== petId
      );
      return [...filteredOld, ...newFeedings];

    case UPDATE_FEEDING:
      return state.map((feeding) =>
        feeding.id === action.payload.id ? action.payload : feeding
      );

    case ADD_FEEDING:
      return [...state, action.payload];
    default:
      return state;
  }
}
