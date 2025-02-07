import {
  FETCH_FEEDINGS,
  UPDATE_FEEDING,
  ADD_FEEDING,
} from "../actions/actionTypes";

const initialState = [];

export default function feedingsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FEEDINGS:
      //console.log("Redux: Updating feedings with", action.payload);
      return [
        ...new Map(
          [...state, ...action.payload].map((f) => [f.id, f])
        ).values(),
      ];

    case UPDATE_FEEDING:
      return state.map((feeding) =>
        feeding.id === action.payload.id
          ? { ...feeding, ...action.payload }
          : feeding
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
