import {
  FETCH_RECURRING_FEEDINGS,
  ADD_RECURRING_FEEDING,
  REMOVE_RECURRING_FEEDING,
} from "../actions/actionTypes";

const initialState = [];

export default function recurringFeedingsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_RECURRING_FEEDINGS:
      return [
        ...new Map(action.payload.map((item) => [item.id, item])).values(),
      ]; // Ensure unique feedings

    case ADD_RECURRING_FEEDING:
      return [...state, action.payload];

    case REMOVE_RECURRING_FEEDING:
      return state.filter((feeding) => feeding.id !== action.payload);

    default:
      return state;
  }
}
