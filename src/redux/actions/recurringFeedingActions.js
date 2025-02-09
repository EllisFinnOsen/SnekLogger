import {
  ADD_RECURRING_FEEDING,
  FETCH_RECURRING_FEEDINGS,
  REMOVE_RECURRING_FEEDING,
  UPDATE_RECURRING_FEEDINGS,
} from "./actionTypes";
import {
  addRecurringFeeding,
  getUpcomingFeedings,
  logRecurringFeedings,
} from "@/database/recurring";

// Add new recurring feeding
export const addRecurringFeedingAction = (feedingData) => async (dispatch) => {
  try {
    await addRecurringFeeding(feedingData);
    console.log("🚀 Dispatching fetchRecurringFeedingsAction after adding...");
    dispatch(fetchRecurringFeedingsAction()); // Ensure Redux updates
  } catch (error) {
    console.error("❌ Error adding recurring feeding:", error);
  }
};

// Fetch recurring feedings from DB
export const fetchRecurringFeedingsAction =
  () => async (dispatch, getState) => {
    const state = getState();
    if (state.recurringFeedings.length > 0) return; // Avoid re-fetching

    try {
      const feedings = await getUpcomingFeedings();

      if (!feedings || feedings.length === 0) {
        console.warn("⚠️ No recurring feedings found. Skipping dispatch.");
        return;
      }

      dispatch({ type: FETCH_RECURRING_FEEDINGS, payload: feedings });
    } catch (error) {
      console.error("Error fetching recurring feedings:", error);
    }
  };

// Log upcoming feedings as regular feedings
export const logRecurringFeedingsAction = () => async (dispatch) => {
  try {
    const newFeedings = await logRecurringFeedings();
    if (newFeedings.length > 0) {
      console.log("Logged new recurring feedings:", newFeedings);
      dispatch(fetchRecurringFeedingsAction()); // This updates recurring feedings
      dispatch(fetchFeedingsAction()); // Also fetch regular feedings
    } else {
      console.warn("No new recurring feedings to log.");
    }
  } catch (error) {
    console.error("Error logging recurring feedings:", error);
  }
};

// Remove recurring feeding
export const removeRecurringFeedingAction = (feedingId) => async (dispatch) => {
  try {
    const db = await openDatabase();
    await db.runAsync("DELETE FROM recurring_feedings WHERE id = ?", [
      feedingId,
    ]);
    dispatch({ type: REMOVE_RECURRING_FEEDING, payload: feedingId });
  } catch (error) {
    console.error("Error removing recurring feeding:", error);
  }
};
