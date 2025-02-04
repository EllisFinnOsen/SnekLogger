import {
  FETCH_PETS,
  FETCH_FEEDINGS,
  FETCH_GROUPS,
  FETCH_GROUP_PETS,
  UPDATE_FEEDING,
  UPDATE_FEEDING_PET,
  ADD_PET,
  ADD_FEEDING, // Add this line
  FETCH_PET,
  DELETE_PET,
  UPDATE_PET,
  FETCH_GROUPS_FOR_PETS,
  ADD_PET_TO_GROUP,
  REMOVE_PET_FROM_GROUP,
  ADD_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
  FETCH_FEEDING_SCHEDULES,
  ADD_FEEDING_SCHEDULE,
  UPDATE_FEEDING_SCHEDULE,
  DELETE_FEEDING_SCHEDULE,
} from "./actionTypes";
import {
  fetchPetsFromDb,
  fetchFeedingsByPetFromDb,
  insertFeedingInDb,
  getGroupsFromDb,
  fetchPetsByGroupIdFromDb,
  updatePetToDb,
  addPetToDb, // Add this line
  deletePetFromDb,
  fetchPetById,
  fetchGroupsForPetFromDb,
  addPetToGroup,
  removePetFromGroup,
  addGroupToDb,
  updateGroupToDb,
  deleteGroupFromDb,
  insertFeedingScheduleInDb,
  fetchFeedingSchedulesByPetIdFromDb,
  updateFeedingScheduleInDb,
  deleteFeedingScheduleFromDb,
  fetchAllFeedingsFromDb,
} from "@/database";

// Fetch all feeding schedules for a specific pet
export const fetchFeedingSchedulesByPet = (petId) => async (dispatch) => {
  try {
    const schedules = await fetchFeedingSchedulesByPetIdFromDb(petId);
    dispatch({ type: FETCH_FEEDING_SCHEDULES, payload: { petId, schedules } });
  } catch (error) {
    console.error("Error fetching feeding schedules for pet", petId, error);
  }
};

export const addFeedingSchedule = (newSchedule) => async (dispatch) => {
  try {
    console.log("addFeedingSchedule: Inserting schedule:", newSchedule);
    const scheduleId = await insertFeedingScheduleInDb(newSchedule);
    console.log("addFeedingSchedule: Inserted schedule with ID:", scheduleId);
    dispatch({
      type: ADD_FEEDING_SCHEDULE,
      payload: { id: scheduleId, ...newSchedule },
    });
    return scheduleId; // Return the new schedule ID
  } catch (error) {
    console.error("Error adding feeding schedule:", error);
    throw error;
  }
};

// Update an existing feeding schedule
export const updateFeedingSchedule =
  (scheduleId, updatedSchedule) => async (dispatch) => {
    try {
      await updateFeedingScheduleInDb(scheduleId, updatedSchedule);
      dispatch({
        type: UPDATE_FEEDING_SCHEDULE,
        payload: { id: scheduleId, ...updatedSchedule },
      });
    } catch (error) {
      console.error("Error updating feeding schedule:", error);
    }
  };

// Delete a feeding schedule
export const deleteFeedingSchedule = (scheduleId) => async (dispatch) => {
  try {
    await deleteFeedingScheduleFromDb(scheduleId);
    dispatch({
      type: DELETE_FEEDING_SCHEDULE,
      payload: scheduleId,
    });
  } catch (error) {
    console.error("Error deleting feeding schedule:", error);
  }
};

export const fetchAllPets = () => async (dispatch) => {
  try {
    const pets = await fetchPetsFromDb();
    dispatch({ type: FETCH_PETS, payload: pets });
  } catch (error) {
    //feeding////console.error("Error fetching pets:", error);
  }
};

export const fetchPets = () => async (dispatch) => {
  try {
    const pet = await fetchPetById();
    dispatch({ type: FETCH_PETS, payload: pets });
  } catch (error) {
    //console.error("Error fetching pet", error);
  }
};

export const fetchFeedings = () => async (dispatch) => {
  try {
    const feedings = await fetchAllFeedingsFromDb();
    console.log("fetchFeedings: Fetched feedings:", feedings);
    dispatch({ type: FETCH_FEEDINGS, payload: feedings });
  } catch (error) {
    console.error("Error fetching feedings:", error);
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

export const fetchGroups = () => async (dispatch) => {
  try {
    const groups = await getGroupsFromDb();
    dispatch({
      type: FETCH_GROUPS,
      payload: groups,
    });
  } catch (error) {
    //console.error("Error fetching groups:", error);
  }
};

export const fetchPetsByGroupId = (groupId) => async (dispatch) => {
  try {
    const pets = await fetchPetsByGroupIdFromDb(groupId);
    dispatch({
      type: FETCH_GROUP_PETS,
      payload: { groupId, pets },
    });
  } catch (error) {
    //console.error(`Error fetching pets for group ${groupId}:`, error);
  }
};

export const updatePet = (updatedPet) => ({
  type: UPDATE_PET,
  payload: updatedPet,
});

export const addPet = (pet) => ({
  type: ADD_PET,
  payload: pet,
});

export const addPetToGroupAction = (groupId, petId) => async (dispatch) => {
  if (!petId) {
    //console.error("Invalid petId:", petId);
    return; // Stop if petId is invalid
  }
  try {
    await addPetToGroup(groupId, petId);
    // Optionally, refresh the pet list for this group:
    await dispatch(fetchPetsByGroupId(groupId));
    // Dispatch an action if you want to update local redux state (optional if fetchPetsByGroupId re-fetches)
    dispatch({
      type: ADD_PET_TO_GROUP,
      payload: { groupId, petId },
    });
  } catch (error) {
    //console.error("Error adding pet to group:", error);
  }
};

export const fetchGroupsForPet = (petId) => async (dispatch) => {
  try {
    const groups = await fetchGroupsForPetFromDb(petId);
    dispatch({
      type: FETCH_GROUPS_FOR_PETS,
      payload: { petId, groups },
    });
  } catch (error) {
    //console.error("Error fetching groups for pet:", error);
  }
};

export const removePetFromGroupAction =
  (groupId, petId) => async (dispatch) => {
    try {
      await removePetFromGroup(groupId, petId);
      // Optionally, re-fetch the pet list for this group:
      await dispatch(fetchPetsByGroupId(groupId));
      dispatch({
        type: REMOVE_PET_FROM_GROUP,
        payload: { groupId, petId },
      });
    } catch (error) {
      //console.error("Error removing pet from group:", error);
    }
  };

export const addFeeding = (newFeeding) => async (dispatch) => {
  try {
    console.log("addFeeding: Inserting feeding:", newFeeding);
    const feedingId = await insertFeedingInDb(newFeeding);
    console.log("addFeeding: Inserted feeding with ID:", feedingId);
    dispatch({
      type: ADD_FEEDING,
      payload: { id: feedingId, ...newFeeding },
    });
    return feedingId;
  } catch (error) {
    console.error("Error adding new feeding:", error);
    throw error;
  }
};

export const addGroup = (group) => ({
  type: ADD_GROUP,
  payload: group,
});

export const deletePet = (petId) => ({
  type: DELETE_PET,
  payload: petId,
});

export const updateGroup = (group) => ({
  type: UPDATE_GROUP,
  payload: group,
});

export const deleteGroup = (groupId) => ({
  type: DELETE_GROUP,
  payload: groupId,
});
