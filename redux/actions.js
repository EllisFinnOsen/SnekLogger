import { FETCH_PETS, FETCH_FEEDINGS } from './actionTypes';
import { fetchPetsFromDb, fetchFeedingsByPetFromDb } from '../database';

export const fetchPets = () => async (dispatch) => {
    try {
      const pets = await fetchPetsFromDb();
      dispatch({ type: FETCH_PETS, payload: pets });
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

export const fetchFeedingsByPet = (petId) => async (dispatch) => {
    try {
      const feedings = await fetchFeedingsByPetFromDb(petId);
      dispatch({ type: FETCH_FEEDINGS, payload: feedings });
    } catch (error) {
      console.error('Error fetching feedings:', error);
    }
  };
  
  export const updateFeeding = (updatedFeeding) => ({
    type: 'UPDATE_FEEDING',
    payload: updatedFeeding,
  });
  
