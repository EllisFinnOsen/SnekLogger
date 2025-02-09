// File: userReducer.js
import {
  FETCH_USER,
  UPDATE_USER,
  SET_FIRST_TIME_USER,
} from "../actions/actionTypes";

const initialState = {
  profile: null, // Holds user profile details
  firstTimeUser: true, // Default to true
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER:
      return { ...state, profile: action.payload };

    case UPDATE_USER:
      return { ...state, profile: action.payload };

    case SET_FIRST_TIME_USER:
      return { ...state, firstTimeUser: action.payload };

    default:
      return state;
  }
}
