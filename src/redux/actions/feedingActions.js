import {
  fetchFeedingsByPetFromDb,
  insertFeedingInDb,
} from "@/database/feedings";
import { ADD_FEEDING, FETCH_FEEDINGS, UPDATE_FEEDING } from "./actionTypes";

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

export const updateFeeding = (updatedFeeding) => ({
  type: UPDATE_FEEDING,
  payload: updatedFeeding,
});

export const fetchFeedingsByPet = (petId) => async (dispatch) => {
  try {
    const feedings = await fetchFeedingsByPetFromDb(petId);
    dispatch({ type: FETCH_FEEDINGS, payload: feedings });
  } catch (error) {
    //feeding////console.error("Error fetching feedings:", error);
  }
};
