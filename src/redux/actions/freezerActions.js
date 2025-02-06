import {
  addPreyToFreezer,
  deletePreyFromFreezer,
  fetchFeedingFreezerUsage,
  fetchFreezerItems,
  linkFeedingToFreezer,
  updateFreezerItemInDB,
} from "@/database/freezer";
import {
  ADD_FREEZER_ITEM,
  DELETE_FREEZER_ITEM,
  FETCH_FEEDING_FREEZER_LINKS,
  FETCH_FREEZER_ITEMS,
  LINK_FEEDING_TO_FREEZER,
  SET_LOW_STOCK_WARNINGS,
  UPDATE_FREEZER_ITEM,
} from "./actionTypes";

const LOW_STOCK_THRESHOLD = 5;

// Fetch freezer items and update Redux state
export const fetchFreezerItemsAction = () => async (dispatch) => {
  try {
    const freezerItems = await fetchFreezerItems(); // ✅ Correct function call
    dispatch({ type: FETCH_FREEZER_ITEMS, payload: freezerItems });
  } catch (error) {
    //console.error("Error fetching freezer items:", error);
  }
};

// Add new prey to freezer
export const addFreezerItem =
  (preyType, quantity, weight, weightType) => async (dispatch) => {
    try {
      const freezerItemId = await addPreyToFreezer(
        preyType,
        quantity,
        weight,
        weightType
      );

      //console.log("Prey added with ID:", freezerItemId); // 🛠 Log new ID

      dispatch({
        type: ADD_FREEZER_ITEM,
        payload: { id: freezerItemId, preyType, quantity, weight, weightType },
      });
    } catch (error) {
      //console.error("Error adding prey to freezer:", error);
    }
  };

// Delete prey from freezer
export const deleteFreezerItem = (freezerId) => async (dispatch) => {
  try {
    await deletePreyFromFreezer(freezerId);
    dispatch({ type: DELETE_FREEZER_ITEM, payload: freezerId }); // ✅ Ensuring correct ID
  } catch (error) {
    //console.error("Error deleting prey from freezer:", error);
  }
};

export const linkFeedingWithFreezer =
  (feedingId, freezerId, quantityUsed) => async (dispatch) => {
    try {
      await linkFeedingToFreezer(feedingId, freezerId, quantityUsed);

      // Fetch the updated freezer list after updating DB
      const updatedFreezerItems = await fetchFreezerItems();

      // Update Redux store with new freezer state
      dispatch({ type: "FETCH_FREEZER_ITEMS", payload: updatedFreezerItems });
    } catch (error) {
      //console.error("Error linking feeding to freezer:", error);
    }
  };

// Fetch what freezer items were used for a feeding
export const fetchFeedingFreezerLinks = (feedingId) => async (dispatch) => {
  try {
    const linkedItems = await fetchFeedingFreezerUsage(feedingId);
    dispatch({
      type: FETCH_FEEDING_FREEZER_LINKS,
      payload: { feedingId, linkedItems },
    });
  } catch (error) {
    //console.error("Error fetching feeding freezer links:", error);
  }
};

// Fetch and update freezer items, then check for low stock
export const fetchFreezerItemsWithWarnings = () => async (dispatch) => {
  try {
    const freezerItems = await fetchFreezerItems(); // ✅ Correct function call

    //console.log("Fetched Freezer Items:", freezerItems); // 🔍 Debugging Log

    // Ensure freezerItems is always an array
    if (!Array.isArray(freezerItems)) {
      //console.warn("freezerItems is not an array!", freezerItems);
      return;
    }

    dispatch({ type: FETCH_FREEZER_ITEMS, payload: freezerItems });

    const lowStockItems = freezerItems.filter((item) => item.quantity <= 5);
    dispatch({ type: SET_LOW_STOCK_WARNINGS, payload: lowStockItems });
  } catch (error) {
    //console.error("Error fetching freezer items:", error);
  }
};

export const updateFreezerItem =
  (id, preyType, quantity, preyWeight, preyWeightType) => async (dispatch) => {
    try {
      // ✅ Fetch updated item from DB after update
      const updatedItem = await updateFreezerItemInDB(id, {
        preyType,
        quantity,
        preyWeight,
        preyWeightType,
      });

      dispatch({
        type: UPDATE_FREEZER_ITEM,
        payload: updatedItem, // ✅ Now correctly dispatching full object
      });
    } catch (error) {
      console.error("Error updating freezer item:", error);
    }
  };
