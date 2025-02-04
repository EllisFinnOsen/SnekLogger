// reducers/feedingSchedulesReducer.js
import {
  FETCH_FEEDING_SCHEDULES,
  ADD_FEEDING_SCHEDULE,
  UPDATE_FEEDING_SCHEDULE,
  DELETE_FEEDING_SCHEDULE,
} from "../actions/actionTypes";

const initialState = {
  // Option 1: Keep all schedules in one array
  schedules: [],
  // Option 2: You could also structure by petId if needed:
  // byPet: {}
};

export default function feedingSchedulesReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FEEDING_SCHEDULES: {
      const { petId, schedules } = action.payload;
      // If you’re grouping by petId, you could do:
      // return { ...state, byPet: { ...state.byPet, [petId]: schedules } };
      // Otherwise, just merge into one array by filtering out existing schedules for that pet:
      const filteredSchedules = state.schedules.filter(
        (sched) => sched.petId !== petId
      );
      return { ...state, schedules: [...filteredSchedules, ...schedules] };
    }
    case ADD_FEEDING_SCHEDULE: {
      return { ...state, schedules: [...state.schedules, action.payload] };
    }
    case UPDATE_FEEDING_SCHEDULE: {
      return {
        ...state,
        schedules: state.schedules.map((sched) =>
          sched.id === action.payload.id ? action.payload : sched
        ),
      };
    }
    case DELETE_FEEDING_SCHEDULE: {
      return {
        ...state,
        schedules: state.schedules.filter(
          (sched) => sched.id !== action.payload
        ),
      };
    }
    default:
      return state;
  }
}
