import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export const fetchAllFeedings = createAsyncThunk(
  "feedings/fetchAll",
  async (db: any) => {
    const feedings = await db.getAllAsync("SELECT * FROM feedings");
    return feedings;
  }
);

// Update the updateFeeding thunk to handle petId
export const updateFeeding = createAsyncThunk(
  "feedings/updateFeeding",
  async ({ db, feedingId, data }: { 
    db: any; 
    feedingId: number; 
    data: any 
  }) => {
    try {
      console.log('updateFeeding: Starting update with:', { feedingId, data });

      // First verify the data exists
      const [existingFeeding] = await db.getAllAsync(
        "SELECT * FROM feedings WHERE id = ?",
        [feedingId]
      );
      console.log('updateFeeding: Existing feeding:', existingFeeding);

      if (!existingFeeding) {
        throw new Error(`No feeding found with id ${feedingId}`);
      }

      // Execute the update
      await db.execAsync(`
        UPDATE feedings 
        SET feedingDate = ?, 
            feedingTime = ?, 
            preyType = ?, 
            complete = ?, 
            notes = ?,
            petId = ?
        WHERE id = ?
      `, [
        data.feedingDate, 
        data.feedingTime, 
        data.preyType, 
        data.complete ? 1 : 0, 
        data.notes, 
        data.petId, 
        feedingId
      ]);

      // Verify the update by fetching the updated record
      const [updatedFeeding] = await db.getAllAsync(
        "SELECT * FROM feedings WHERE id = ?",
        [feedingId]
      );
      
      console.log('updateFeeding: Updated feeding:', updatedFeeding);

      if (!updatedFeeding) {
        throw new Error('Failed to fetch updated feeding');
      }

      // Convert the numeric complete value back to boolean
      const formattedFeeding = {
        ...updatedFeeding,
        complete: Boolean(updatedFeeding.complete)
      };

      return formattedFeeding;
    } catch (error) {
      console.error('updateFeeding failed:', error);
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
        console.log('Redux: Updating feeding state with:', action.payload);
        const index = state.list.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
          console.log('Redux: State updated successfully');
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
