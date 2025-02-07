import {
  fetchFeedingsByPetFromDb,
  insertFeedingInDb,
  updateFeedingInDb,
} from "@/database/feedings";
import { ADD_FEEDING, FETCH_FEEDINGS, UPDATE_FEEDING } from "./actionTypes";
import { fetchFreezerItemsAction } from "./freezerActions";
import { updateFreezerQuantityBasedOnFeeding } from "@/database/freezer";

// Add a new feeding
export const addFeeding = (newFeeding) => async (dispatch) => {
  try {
    const feedingId = await insertFeedingInDb(newFeeding);
    console.log("Dispatching ADD_FEEDING for feeding:", {
      id: feedingId,
      ...newFeeding,
    });

    dispatch({
      type: ADD_FEEDING,
      payload: { id: feedingId, ...newFeeding },
    });
  } catch (error) {
    console.error("Error adding new feeding:", error);
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
    console.error("Error updating feeding:", error);
  }
};

export const fetchFeedingsByPet = (petId) => async (dispatch) => {
  try {
    const feedings = await fetchFeedingsByPetFromDb(petId);
    dispatch({ type: FETCH_FEEDINGS, payload: feedings });
  } catch (error) {
    //feeding////console.error("Error fetching feedings:", error);
  }
};
