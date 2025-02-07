import {
  fetchUserProfileFromDb,
  updateUserProfileInDb,
} from "@/database/users";
import { FETCH_USER, UPDATE_USER } from "./actionTypes";

// Fetch user profile from database
export const fetchUserProfile = () => async (dispatch) => {
  try {
    const userProfile = await fetchUserProfileFromDb();
    dispatch({ type: FETCH_USER, payload: userProfile });
  } catch (error) {
    //console.error("Error fetching user profile:", error);
  }
};

// Update user profile in Redux and Database
export const updateUserProfile = (updatedUser) => async (dispatch) => {
  try {
    await updateUserProfileInDb(updatedUser);
    dispatch({ type: UPDATE_USER, payload: updatedUser });
  } catch (error) {
    //console.error("Error updating user profile:", error);
  }
};
