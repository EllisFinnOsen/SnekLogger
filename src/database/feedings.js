import {
  unlinkFeedingFromFreezer,
  updateFreezerQuantityBasedOnFeeding,
} from "./freezer.js";
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
  //console.log("Fetching feeding from DB for ID:", feedingId);
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
    //console.error("Error fetching feeding by ID:", error);
    throw error;
  }
};

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

    return result;
  } catch (error) {
    //console.error("Error updating feeding in DB:", error);
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
    // Check if a feeding with the same petId, date, and time already exists
    const existingFeeding = await db.getFirstAsync(
      "SELECT id FROM feedings WHERE petId = ? AND feedingDate = ? AND feedingTime = ?",
      [petId, feedingDate, feedingTime]
    );

    if (existingFeeding) {
      //console.warn("Feeding already exists, skipping insert.");
      return existingFeeding.id; // Return existing ID instead of inserting duplicate
    }

    const result = await db.runAsync(
      `INSERT INTO feedings 
        (petId, feedingDate, feedingTime, preyType, preyWeight, preyWeightType, notes, complete)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        petId,
        feedingDate,
        feedingTime,
        preyType,
        preyWeight ?? 0,
        preyWeightType ?? "g",
        notes ?? "",
        complete ? 1 : 0,
      ]
    );

    return result.lastInsertRowId;
  } catch (error) {
    //console.error("Error inserting feeding in DB:", error);
    throw error;
  }
};

export const deleteFeedingFromDb = async (feedingId) => {
  try {
    const db = await openDatabase();

    // First, remove any linked freezer items
    await unlinkFeedingFromFreezer(feedingId);

    // Now, delete the feeding record
    const result = await db.runAsync("DELETE FROM feedings WHERE id = ?", [
      feedingId,
    ]);

    return result;
  } catch (error) {
    console.error("Error deleting feeding from DB:", error);
    throw error;
  }
};
