import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { getDatabase } from "@/utils/database"; // Adjust the import to your actual utils path

const initialState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
};

// Thunk for fetching feedings
export const fetchFeedings = createAsyncThunk<any[], string>(
  "feedings/fetchFeedings",
  async (query, { rejectWithValue }) => {
    console.log("fetchFeedings thunk triggered with query:", query);
    try {
      const db = getDatabase(); // Use your centralized database getter
      const feedings = await runQuery(db, query); // runQuery should be imported from your database utility
      console.log("fetchFeedings retrieved data:", feedings);
      return feedings;
    } catch (error) {
      console.error("fetchFeedings error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const feedingsSlice = createSlice({
  name: "feedings",
  initialState,
  reducers: {
    setFeedings(state, action) {
      console.log("setFeedings action payload:", action.payload);
      const feedings = action.payload;
      state.byId = feedings.reduce((acc, feeding) => {
        acc[feeding.id] = feeding;
        return acc;
      }, {});
      state.allIds = feedings.map((feeding) => feeding.id);
    },
    updateFeeding(state, action) {
      console.log("updateFeeding action payload:", action.payload);
      const feeding = action.payload;
      state.byId[feeding.id] = { ...state.byId[feeding.id], ...feeding };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedings.pending, (state) => {
        console.log("fetchFeedings pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedings.fulfilled, (state, action) => {
        console.log("fetchFeedings fulfilled with data:", action.payload);
        const feedings = action.payload;
        state.byId = feedings.reduce((acc, feeding) => {
          acc[feeding.id] = feeding;
          return acc;
        }, {});
        state.allIds = feedings.map((feeding) => feeding.id);
        state.loading = false;
      })
      .addCase(fetchFeedings.rejected, (state, action) => {
        console.error("fetchFeedings rejected with error:", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFeedings, updateFeeding } = feedingsSlice.actions;
export default feedingsSlice.reducer;

// Selector to get the entire feedings state
const selectFeedingsState = (state) => state.feedings;

// Memoized selector for all feedings
export const selectFeedings = createSelector(
  [selectFeedingsState],
  (feedingsState) => feedingsState.allIds.map((id) => feedingsState.byId[id])
);

// Memoized selector for a feeding by ID
export const selectFeedingById = createSelector(
  [selectFeedingsState, (_, id) => id],
  (feedingsState, id) => feedingsState.byId[id]
);
