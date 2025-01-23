import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Pet {
  id: number;
  name: string;
  species: string;
  morph: string;
  birthDate: string;
  weight: number;
  imageURL?: string;
}

const initialState: Pet[] = [];

const petsSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    setPets(state, action: PayloadAction<Pet[]>) {
      return action.payload;
    },
    addPet(state, action: PayloadAction<Pet>) {
      state.push(action.payload);
    },
    removePet(state, action: PayloadAction<number>) {
      return state.filter((pet) => pet.id !== action.payload);
    },
  },
});

export const { setPets, addPet, removePet } = petsSlice.actions;
export default petsSlice.reducer;
