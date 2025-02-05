// File: userReducer.js
import { FETCH_USER, UPDATE_USER } from "../actions/actionTypes";

const initialState = {
  profile: null, // Holds user profile details
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER:
      return { ...state, profile: action.payload };

    case UPDATE_USER:
      return { ...state, profile: action.payload };

    default:
      return state;
  }
}
