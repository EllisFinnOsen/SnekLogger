import {
  FETCH_PETS,
  FETCH_FEEDINGS,
  FETCH_GROUPS,
  FETCH_GROUP_PETS,
  UPDATE_FEEDING,
} from "./actionTypes";
import {
  fetchPetsFromDb,
  fetchFeedingsByPetFromDb,
  fetchGroupsFromDb,
  fetchGroupPetsFromDb,
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
    const groups = await fetchGroupsFromDb();
    dispatch({ type: FETCH_GROUPS, payload: groups });
  } catch (error) {
    //feeding//console.error("Error fetching groups:", error);
  }
};

export const fetchGroupPets = () => async (dispatch) => {
  try {
    const groupPets = await fetchGroupPetsFromDb();
    dispatch({ type: FETCH_GROUP_PETS, payload: groupPets });
  } catch (error) {
    //feeding//console.error("Error fetching group pets:", error);
  }
};

export const updateFeeding = (updatedFeeding) => ({
  type: UPDATE_FEEDING,
  payload: updatedFeeding,
});
