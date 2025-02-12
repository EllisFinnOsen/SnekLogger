import {
  deleteFeedingFromDb,
  fetchFeedingsByPetFromDb,
  insertFeedingInDb,
  updateFeedingInDb,
} from "@/database/feedings";
import {
  ADD_FEEDING,
  FETCH_FEEDINGS,
  REMOVE_FEEDING,
  REMOVE_FREEZER_LINK,
  UPDATE_FEEDING,
} from "./actionTypes";
import { fetchFreezerItemsAction } from "./freezerActions";
import { updateFreezerQuantityBasedOnFeeding } from "@/database/freezer";

// Add a new feeding
export const addFeeding = (newFeeding) => async (dispatch) => {
  try {
    const feedingId = await insertFeedingInDb(newFeeding);
    /*//console.log("Dispatching ADD_FEEDING for feeding:", {
      id: feedingId,
      ...newFeeding,
    });*/

    dispatch({
      type: ADD_FEEDING,
      payload: { id: feedingId, ...newFeeding },
    });
  } catch (error) {
    //console.error("Error adding new feeding:", error);
  }
};

export const updateFeeding = (updatedFeeding) => async (dispatch) => {
  try {
    await updateFeedingInDb(
      updatedFeeding.id,
      updatedFeeding.petId,
      updatedFeeding.feedingDate,
      updatedFeeding.feedingTime,
      updatedFeeding.preyType,
      updatedFeeding.preyWeight,
      updatedFeeding.preyWeightType,
      updatedFeeding.notes,
      updatedFeeding.complete
    );

    // ✅ Now update freezer quantity in Redux
    await updateFreezerQuantityBasedOnFeeding(
      updatedFeeding.id,
      updatedFeeding.complete
    );

    // ✅ Dispatch Redux state update
    dispatch({ type: UPDATE_FEEDING, payload: updatedFeeding });

    // ✅ Refresh Redux freezer state
    dispatch(fetchFreezerItemsAction());
  } catch (error) {
    //console.error("Error updating feeding:", error);
  }
};

export const fetchFeedingsByPet = (petId) => async (dispatch) => {
  try {
    //console.log(`Fetching feedings for pet ID: ${petId}`);

    const feedings = await fetchFeedingsByPetFromDb(petId);
    //console.log(`Fetched feedings for pet ${petId}:`, feedings); // 🔍 Debugging log

    dispatch({ type: FETCH_FEEDINGS, payload: feedings });

    //console.log("Dispatched feedings to Redux:", feedings);
  } catch (error) {
    //console.error("Error fetching feedings:", error);
  }
};

export const deleteFeeding = (feedingId) => async (dispatch) => {
  try {
    // Delete from database
    await deleteFeedingFromDb(feedingId);

    // Remove freezer link from Redux state
    dispatch({ type: REMOVE_FREEZER_LINK, payload: feedingId });

    // Remove feeding from Redux state
    dispatch({ type: REMOVE_FEEDING, payload: feedingId });

    // Refresh freezer items to reflect changes
    dispatch(fetchFreezerItemsAction());
  } catch (error) {
    console.error("Error deleting feeding:", error);
  }
};
