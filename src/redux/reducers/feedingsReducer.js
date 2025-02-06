import {
  FETCH_FEEDINGS,
  UPDATE_FEEDING,
  ADD_FEEDING,
} from "../actions/actionTypes";

const initialState = [];

export default function feedingsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FEEDINGS:
      const newFeedings = action.payload;
      const petId = newFeedings.length ? newFeedings[0].petId : null;

      if (!petId) return state;

      // Keep only unique feedings (avoid duplicate entries)
      const existingFeedings = state.filter((f) => f.petId === petId);
      const uniqueNewFeedings = newFeedings.filter(
        (newF) => !existingFeedings.some((f) => f.id === newF.id)
      );

      return [...state.filter((f) => f.petId !== petId), ...uniqueNewFeedings];

    case UPDATE_FEEDING:
      return state.map((feeding) =>
        feeding.id === action.payload.id ? action.payload : feeding
      );

    case ADD_FEEDING:
      // Check if the feeding already exists
      if (state.some((feeding) => feeding.id === action.payload.id)) {
        return state; // Prevent duplicate additions
      }
      return [...state, action.payload];

    default:
      return state;
  }
}
