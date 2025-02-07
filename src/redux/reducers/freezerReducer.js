import {
  FETCH_FREEZER_ITEMS,
  ADD_FREEZER_ITEM,
  DELETE_FREEZER_ITEM,
  UPDATE_FREEZER_ITEM,
  SET_LOW_STOCK_WARNINGS,
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

    case SET_LOW_STOCK_WARNINGS:
      return {
        ...state,
        lowStockWarnings: Array.isArray(action.payload) ? action.payload : [],
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
            ? { ...item, quantity: Math.max(0, action.payload.newQuantity) } // ✅ No double decrement
            : item
        ),
      };

    default:
      return state;
  }
}
