import {
  LINK_FEEDING_TO_FREEZER,
  FETCH_FEEDING_FREEZER_LINKS,
} from "./actionTypes";

const initialState = {};

export default function feedingFreezerReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FEEDING_FREEZER_LINKS:
      return {
        ...state,
        [action.payload.feedingId]: action.payload.linkedItems,
      };

    case LINK_FEEDING_TO_FREEZER:
      return {
        ...state,
        [action.payload.feedingId]: [
          ...(state[action.payload.feedingId] || []),
          {
            freezerId: action.payload.freezerId,
            quantityUsed: action.payload.quantityUsed,
          },
        ],
      };

    default:
      return state;
  }
}
