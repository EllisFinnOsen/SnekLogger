import {
  FETCH_FREEZER_ITEMS,
  ADD_FREEZER_ITEM,
  DELETE_FREEZER_ITEM,
  UPDATE_FREEZER_ITEM,
  SET_LOW_STOCK_WARNINGS,
  LINK_FEEDING_TO_FREEZER,
} from "../actions/actionTypes";

const initialState = {
  items: [],
  lowStockWarnings: [],
};

export default function freezerReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FREEZER_ITEMS:
      return {
        ...state,
        items: Array.isArray(action.payload) ? action.payload : [], // ✅ Ensure array
      };

    case LINK_FEEDING_TO_FREEZER:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.freezerId
            ? {
                ...item,
                quantity: Math.max(
                  0,
                  item.quantity - action.payload.quantityUsed
                ), // ✅ Decrement stock
              }
            : item
        ),
      };

    case ADD_FREEZER_ITEM:
      return {
        ...state,
        items: [...(state.items || []), action.payload], // ✅ Ensuring it's always an array
      };

    case DELETE_FREEZER_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload), // ✅ Fix here
      };

    case UPDATE_FREEZER_ITEM:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                preyType: action.payload.preyType,
                quantity: action.payload.quantity, // ✅ Correctly updating quantity
                weight: action.payload.preyWeight,
                weightType: action.payload.preyWeightType,
              }
            : item
        ),
      };

    default:
      return state;
  }
}
