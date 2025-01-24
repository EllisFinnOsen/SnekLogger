import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export const fetchAllFeedings = createAsyncThunk(
  "feedings/fetchAll",
  async (db: any) => {
    const feedings = await db.getAllAsync("SELECT * FROM feedings");
    return feedings;
  }
);

export const updateFeeding = createAsyncThunk(
  "feedings/updateFeeding",
  async (
    { db, feedingId, data }: { db: any; feedingId: number; data: any },
    { rejectWithValue }
  ) => {
    try {
      const { feedingDate, feedingTime, preyType, complete, notes } = data;
      await db.execAsync(`
        UPDATE feedings
        SET 
          feedingDate = '${feedingDate}',
          feedingTime = '${feedingTime}',
          preyType = '${preyType}',
          complete = ${complete ? 1 : 0},
          notes = '${notes}'
        WHERE id = ${feedingId};
      `);
      return { feedingId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

type Feeding = {
  id: number;
  petId: number;
  feedingDate: string;
  feedingTime: string;
  preyType: string;
  notes: string;
  complete: boolean;
};

interface FeedingsState {
  list: Feeding[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FeedingsState = {
  list: [],
  status: "idle",
  error: null,
};

const feedingsSlice = createSlice({
  name: "feedings",
  initialState,
  reducers: {
    addFeeding(state, action: PayloadAction<Feeding>) {
      state.list.push(action.payload);
    },
    removeFeeding(state, action: PayloadAction<number>) {
      state.list = state.list.filter((f) => f.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFeedings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllFeedings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchAllFeedings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      // Handle updating the feeding in the state
      .addCase(updateFeeding.fulfilled, (state, action) => {
        console.log("Updating state with:", action.payload);
        const { feedingId, ...updatedData } = action.payload;
        const feedingIndex = state.list.findIndex((f) => f.id === feedingId);
        if (feedingIndex !== -1) {
          state.list[feedingIndex] = {
            ...state.list[feedingIndex],
            ...updatedData,
          };
        }
      })
      .addCase(updateFeeding.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const { addFeeding, removeFeeding } = feedingsSlice.actions;

export default feedingsSlice.reducer;
