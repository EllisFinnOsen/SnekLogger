import { openDatabase } from "./index.js";

// Fetch all pets
export const fetchPetsFromDb = async () => {
  try {
    const db = await openDatabase();
    const result = await db.getAllAsync("SELECT * FROM pets");
    //////console("Fetched pets from DB:", result);
    return result;
  } catch (error) {
    ////console.error("Error fetching pets:", error);
    throw error;
  }
};

// Fetch feedings by petId
export const fetchFeedingsByPetFromDb = async (petId) => {
  if (petId === undefined || petId === null) {
    throw new Error("fetchFeedingsByPetFromDb requires a valid petId");
  }

  try {
    const db = await openDatabase();
    const result = await db.getAllAsync(
      "SELECT * FROM feedings WHERE petId = ?",
      [petId]
    );
    //console.log("Fetched feedings from DB for petId", petId, ":", result);
    return result;
  } catch (error) {
    //console.error("Error fetching feedings:", error);
    throw error;
  }
};

// Fetch a single feeding by its ID
export const fetchFeedingByIdFromDb = async (feedingId) => {
  console.log("Fetching feeding from DB for ID:", feedingId);
  try {
    const db = await openDatabase();
    const result = await db.getFirstAsync(
      "SELECT * FROM feedings WHERE id = ?",
      [feedingId]
    );
    return (
      result ?? {
        petId: null,
        feedingDate: "",
        feedingTime: "",
        preyType: "",
        preyWeight: 0, // Default to 0 if not found
        preyWeightType: "g",
        complete: 0,
        notes: "",
      }
    );
  } catch (error) {
    console.error("Error fetching feeding by ID:", error);
    throw error;
  }
};

// Update feeding (e.g., feedingDate, feedingTime) in DB
export const updateFeedingInDb = async (
  feedingId,
  petId,
  feedingDate,
  feedingTime,
  preyType,
  preyWeight,
  preyWeightType,
  notes,
  complete
) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      `UPDATE feedings 
       SET petId = ?, 
           feedingDate = ?, 
           feedingTime = ?, 
           preyType = ?, 
           preyWeight = ?, 
           preyWeightType = ?, 
           notes = ?,
           complete = ? 
       WHERE id = ?`,
      [
        petId,
        feedingDate,
        feedingTime,
        preyType,
        preyWeight ?? 0,
        preyWeightType ?? "g",
        notes ?? "",
        complete ?? 0,
        feedingId,
      ]
    );

    if (complete === 1) {
      const linkedItems = await fetchFeedingFreezerUsage(feedingId);
      for (const item of linkedItems) {
        await updateFreezerItemInDB(item.freezerId, {
          quantity: Math.max(item.quantity - item.quantityUsed, 0),
        });
      }
    }

    return result;
  } catch (error) {
    console.error("Error updating feeding in DB:", error);
    throw error;
  }
};

export const insertFeedingInDb = async ({
  petId,
  feedingDate,
  feedingTime,
  preyType,
  preyWeight,
  preyWeightType,
  notes,
  complete,
}) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      `INSERT INTO feedings 
        (petId, feedingDate, feedingTime, preyType, preyWeight, preyWeightType, notes, complete)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        petId,
        feedingDate,
        feedingTime,
        preyType,
        preyWeight ?? 0, // Default to 0 if missing
        preyWeightType ?? "g",
        notes ?? "",
        complete ? 1 : 0, // Ensure it's stored as an integer
      ]
    );

    return result.lastInsertRowId; // Return the ID of the newly created feeding
  } catch (error) {
    console.error("Error inserting feeding in DB:", error);
    throw error;
  }
};
