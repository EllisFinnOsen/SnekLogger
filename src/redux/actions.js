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
} from "@/database";

export const fetchPets = () => async (dispatch) => {
  try {
    const pets = await fetchPetsFromDb();
    dispatch({ type: FETCH_PETS, payload: pets });
  } catch (error) {
    //feeding////console.error("Error fetching pets:", error);
  }
};

export const fetchPet = () => async (dispatch) => {
  try {
    const pet = await fetchPetById();
    dispatch({ type: FETCH_PETS, payload: pets });
  } catch (error) {
    //console.error("Error fetching pet", error);
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

export const updateFeeding = (updatedFeeding) => ({
  type: UPDATE_FEEDING,
  payload: updatedFeeding,
});

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

// Add a new feeding
export const addFeeding = (newFeeding) => async (dispatch) => {
  try {
    const feedingId = await insertFeedingInDb(newFeeding);
    dispatch({
      type: ADD_FEEDING,
      payload: { id: feedingId, ...newFeeding },
    });
  } catch (error) {
    console.error("Error adding new feeding:", error);
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
