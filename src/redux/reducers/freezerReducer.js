import {
  FETCH_FREEZER_ITEMS,
  ADD_FREEZER_ITEM,
  DELETE_FREEZER_ITEM,
  UPDATE_FREEZER_ITEM,
  SET_LOW_STOCK_WARNINGS,
  REMOVE_FREEZER_LINK, // ✅ Import new action type
} from "../actions/actionTypes";

const initialState = {
  items: [], // List of freezer items
  freezerLinks: {}, // ✅ Store links as { feedingId: freezerId }
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
        items: [...(state.items || []), action.payload], // ✅ Ensure it's always an array
      };

    case DELETE_FREEZER_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload), // ✅ Remove freezer item
      };

    case UPDATE_FREEZER_ITEM:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.newQuantity) } // ✅ Prevent negative quantity
            : item
        ),
      };

    case REMOVE_FREEZER_LINK:
      /*console.log(
        `Redux removing freezer link for feedingId: ${action.payload}`
      );*/

      const newLinks = { ...state.freezerLinks };
      delete newLinks[action.payload]; // ✅ Ensure it's removed from Redux state

      return {
        ...state,
        freezerLinks: newLinks,
      };
    default:
      return state;
  }
}
