import { openDatabase } from "./index.js";

// Fetch a single pet by its ID
export const fetchPetById = async (petId) => {
  try {
    const db = await openDatabase();
    // Using getFirstAsync (similar to your fetchFeedingByIdFromDb function)
    const pet = await db.getFirstAsync("SELECT * FROM pets WHERE id = ?", [
      petId,
    ]);
    return pet || null;
  } catch (error) {
    //console.error("Error fetching pet by ID:", error);
    throw error;
  }
};

// Function to add a new pet to the database
export const addPetToDb = async (pet) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      `INSERT INTO pets (name, category, species, morph, birthDate, weight, weightType, imageURL)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pet.name,
        pet.category,
        pet.species,
        pet.morph,
        pet.birthDate,
        pet.weight,
        pet.weightType,
        pet.imageURL,
      ]
    );
    //console.log("addPetToDb result:", result);
    // Explicitly return lastInsertRowId:
    return result.lastInsertRowId;
  } catch (error) {
    //console.error("Error adding pet to database:", error);
    throw error;
  }
};

export const updatePetToDb = async (pet) => {
  try {
    ////console("Updating pet:", pet); // Should log an object with id and other fields
    const db = await openDatabase();
    const result = await db.runAsync(
      `UPDATE pets
       SET
         name = ?,
         category = ?,
         species = ?,
         morph = ?,
         birthDate = ?,
         weight = ?,
         weightType = ?,
         imageURL = ?
       WHERE id = ?`,
      [
        pet.name,
        pet.category,
        pet.species,
        pet.morph,
        pet.birthDate,
        pet.weight,
        pet.weightType,
        pet.imageURL,
        pet.id,
      ]
    );
    ////console("Update result:", result);
    return result;
  } catch (error) {
    //console.error("Error updating pet in database:", error);
    throw error;
  }
};

export const deletePetFromDb = async (petId) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync("DELETE FROM pets WHERE id = ?", [petId]);
    return result;
  } catch (error) {
    //console.error("Error deleting pet from DB:", error);
    throw error;
  }
};
