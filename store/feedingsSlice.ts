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
  async ({ db, feedingId, data }: { db: any; feedingId: number; data: any }) => {
    try {
      const { feedingDate, feedingTime, preyType, complete, notes } = data;
      
      await db.execAsync(`
        UPDATE feedings 
        SET feedingDate = ?, 
            feedingTime = ?, 
            preyType = ?, 
            complete = ?, 
            notes = ?
        WHERE id = ?
      `, [feedingDate, feedingTime, preyType, complete ? 1 : 0, notes, feedingId]);

      return {
        id: feedingId,
        ...data
      };
    } catch (error) {
      throw error;
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
        const updatedFeeding = action.payload;
        const index = state.list.findIndex(f => f.id === updatedFeeding.id);
        if (index !== -1) {
          state.list[index] = {
            ...state.list[index],
            ...updatedFeeding
          };
        }
        state.status = "succeeded";
      })
      .addCase(updateFeeding.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const { addFeeding, removeFeeding } = feedingsSlice.actions;

export default feedingsSlice.reducer;
