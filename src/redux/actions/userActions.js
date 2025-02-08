import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchUserProfileFromDb,
  updateUserProfileInDb,
} from "@/database/users";
import { FETCH_USER, UPDATE_USER, SET_FIRST_TIME_USER } from "./actionTypes";

// Fetch user profile and first-time user status
export const fetchUserProfile = () => async (dispatch) => {
  try {
    const userProfile = await fetchUserProfileFromDb();
    const firstTime = await AsyncStorage.getItem("firstTimeUser");
    dispatch({ type: FETCH_USER, payload: userProfile });
    dispatch({
      type: SET_FIRST_TIME_USER,
      payload: firstTime === null ? true : JSON.parse(firstTime),
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

// Mark first-time user flow as completed
export const setFirstTimeUser = (value) => async (dispatch) => {
  await AsyncStorage.setItem("firstTimeUser", JSON.stringify(value));
  dispatch({ type: SET_FIRST_TIME_USER, payload: value });
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
