import { fetchPetById } from "@/database/pets";
import { ADD_PET, DELETE_PET, FETCH_PETS, UPDATE_PET } from "./actionTypes";
import { fetchPetsFromDb } from "@/database/feedings";

export const updatePet = (updatedPet) => ({
  type: UPDATE_PET,
  payload: updatedPet,
});

export const addPet = (pet) => ({
  type: ADD_PET,
  payload: pet,
});

export const fetchPets = () => async (dispatch) => {
  try {
    const pets = await fetchPetsFromDb();
    dispatch({ type: FETCH_PETS, payload: pets });
  } catch (error) {
    //feeding////console.error("Error fetching pets:", error);
  }
};

export const fetchPet = () => async (dispatch) => {
  try {
    const pet = await fetchPetById();
    dispatch({ type: FETCH_PETS, payload: pets });
  } catch (error) {
    //console.error("Error fetching pet", error);
  }
};

export const deletePet = (petId) => ({
  type: DELETE_PET,
  payload: petId,
});
