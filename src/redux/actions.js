import {
  FETCH_PETS,
  FETCH_FEEDINGS,
  FETCH_GROUPS,
  FETCH_GROUP_PETS,
  UPDATE_FEEDING,
  ADD_PET, // Add this line
} from "./actionTypes";
import {
  fetchPetsFromDb,
  fetchFeedingsByPetFromDb,
  getGroupsFromDb,
  fetchPetsByGroupIdFromDb,
  addPetToDb, // Add this line
} from "@/database";

export const fetchPets = () => async (dispatch) => {
  try {
    const pets = await fetchPetsFromDb();
    dispatch({ type: FETCH_PETS, payload: pets });
  } catch (error) {
    //feeding//console.error("Error fetching pets:", error);
  }
};

export const fetchFeedingsByPet = (petId) => async (dispatch) => {
  try {
    const feedings = await fetchFeedingsByPetFromDb(petId);
    dispatch({ type: FETCH_FEEDINGS, payload: feedings });
  } catch (error) {
    //feeding//console.error("Error fetching feedings:", error);
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
    console.error("Error fetching groups:", error);
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
    console.error(`Error fetching pets for group ${groupId}:`, error);
  }
};

export const updateFeeding = (updatedFeeding) => ({
  type: UPDATE_FEEDING,
  payload: updatedFeeding,
});

export const addPet = (pet) => ({
  type: ADD_PET,
  payload: pet,
});
