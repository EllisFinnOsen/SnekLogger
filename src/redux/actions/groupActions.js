import {
  fetchGroupsForPetFromDb,
  fetchPetsByGroupIdFromDb,
  getGroupsFromDb,
  removePetFromGroup,
} from "@/database/groups";
import {
  ADD_GROUP,
  ADD_PET_TO_GROUP,
  DELETE_GROUP,
  FETCH_GROUP_PETS,
  FETCH_GROUPS,
  FETCH_GROUPS_FOR_PETS,
  REMOVE_PET_FROM_GROUP,
  UPDATE_GROUP,
} from "./actionTypes";

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
      await dispatch(fetchPetsByGroupIdFromDb(groupId));
      dispatch({
        type: REMOVE_PET_FROM_GROUP,
        payload: { groupId, petId },
      });
    } catch (error) {
      //console.error("Error removing pet from group:", error);
    }
  };
export const addGroup = (group) => ({
  type: ADD_GROUP,
  payload: group,
});
export const updateGroup = (group) => ({
  type: UPDATE_GROUP,
  payload: group,
});

export const deleteGroup = (groupId) => ({
  type: DELETE_GROUP,
  payload: groupId,
});
