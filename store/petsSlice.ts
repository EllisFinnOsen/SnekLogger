// store/petsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// We'll assume you have some way to access the DB instance.
// One approach is to pass it as an argument to the thunk.

export const fetchPets = createAsyncThunk("pets/fetchPets", async (db: any) => {
  // 'db' is the SQLite instance (or something similar).
  const rows = await db.getAllAsync("SELECT * FROM pets");
  return rows;
});

type Pet = {
  id: number;
  name: string;
  species: string;
  morph: string;
  birthDate: string;
  weight: number;
  imageURL: string;
};

interface PetsState {
  list: Pet[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PetsState = {
  list: [],
  status: "idle",
  error: null,
};

const petsSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    // If you want synchronous updates, you can define them here
    setPets(state, action: PayloadAction<Pet[]>) {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default petsSlice.reducer;
