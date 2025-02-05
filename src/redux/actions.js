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
  FETCH_USER,
  UPDATE_USER,
  FETCH_FREEZER_ITEMS,
  ADD_FREEZER_ITEM,
  DELETE_FREEZER_ITEM,
  UPDATE_FREEZER_ITEM,
  LINK_FEEDING_TO_FREEZER,
  FETCH_FEEDING_FREEZER_LINKS,
  SET_LOW_STOCK_WARNINGS,
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
  fetchUserProfileFromDb,
  updateUserProfileInDb,
  fetchFreezerItems,
  addPreyToFreezer,
  deletePreyFromFreezer,
  linkFeedingToFreezer,
  fetchFeedingFreezerUsage,
} from "@/database";

const LOW_STOCK_THRESHOLD = 5;

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

export const updateGroup = (group) => ({
  type: UPDATE_GROUP,
  payload: group,
});

export const deleteGroup = (groupId) => ({
  type: DELETE_GROUP,
  payload: groupId,
});

// Fetch user profile from database
export const fetchUserProfile = () => async (dispatch) => {
  try {
    const userProfile = await fetchUserProfileFromDb();
    dispatch({ type: FETCH_USER, payload: userProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

// Update user profile in Redux and Database
export const updateUserProfile = (updatedUser) => async (dispatch) => {
  try {
    await updateUserProfileInDb(updatedUser);
    dispatch({ type: UPDATE_USER, payload: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
};

// Fetch freezer items and update Redux state
export const fetchFreezerItemsAction = () => async (dispatch) => {
  try {
    const freezerItems = await fetchFreezerItems(); // ✅ Correct function call
    dispatch({ type: FETCH_FREEZER_ITEMS, payload: freezerItems });
  } catch (error) {
    console.error("Error fetching freezer items:", error);
  }
};

// Add new prey to freezer
export const addFreezerItem =
  (preyType, quantity, weight, weightType) => async (dispatch) => {
    try {
      console.log("Attempting to add prey:", {
        preyType,
        quantity,
        weight,
        weightType,
      }); // 🛠 Debugging log

      const freezerItemId = await addPreyToFreezer(
        preyType,
        quantity,
        weight,
        weightType
      );

      console.log("Prey added with ID:", freezerItemId); // 🛠 Log new ID

      dispatch({
        type: ADD_FREEZER_ITEM,
        payload: { id: freezerItemId, preyType, quantity, weight, weightType },
      });
    } catch (error) {
      console.error("Error adding prey to freezer:", error);
    }
  };

// Delete prey from freezer
export const deleteFreezerItem = (freezerId) => async (dispatch) => {
  try {
    await deletePreyFromFreezer(freezerId);
    dispatch({ type: DELETE_FREEZER_ITEM, payload: freezerId }); // ✅ Ensuring correct ID
  } catch (error) {
    console.error("Error deleting prey from freezer:", error);
  }
};

// Link a feeding to a freezer item (reducing inventory)
export const linkFeedingWithFreezer =
  (feedingId, freezerId, quantityUsed) => async (dispatch) => {
    try {
      await linkFeedingToFreezer(feedingId, freezerId, quantityUsed);
      dispatch({
        type: LINK_FEEDING_TO_FREEZER,
        payload: { feedingId, freezerId, quantityUsed },
      });
    } catch (error) {
      console.error("Error linking feeding to freezer:", error);
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
    console.error("Error fetching feeding freezer links:", error);
  }
};

// Fetch and update freezer items, then check for low stock
export const fetchFreezerItemsWithWarnings = () => async (dispatch) => {
  try {
    const freezerItems = await fetchFreezerItems(); // ✅ Correct function call

    console.log("Fetched Freezer Items:", freezerItems); // 🔍 Debugging Log

    // Ensure freezerItems is always an array
    if (!Array.isArray(freezerItems)) {
      console.warn("freezerItems is not an array!", freezerItems);
      return;
    }

    dispatch({ type: FETCH_FREEZER_ITEMS, payload: freezerItems });

    const lowStockItems = freezerItems.filter((item) => item.quantity <= 5);
    dispatch({ type: SET_LOW_STOCK_WARNINGS, payload: lowStockItems });
  } catch (error) {
    console.error("Error fetching freezer items:", error);
  }
};

export const updateFreezerItem = (id, quantity) => async (dispatch) => {
  try {
    await updateFreezerItem(id, quantity);
    dispatch({ type: UPDATE_FREEZER_ITEM, payload: { id, quantity } });
  } catch (error) {
    console.error("Error updating freezer item:", error);
  }
};
