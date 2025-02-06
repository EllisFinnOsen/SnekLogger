import { openDatabase } from "./index.js";

export const addPreyToFreezer = async (
  preyType,
  quantity,
  weight,
  weightType
) => {
  try {
    if (!preyType || quantity == null || weight == null || !weightType) {
      throw new Error("Missing required fields in addPreyToFreezer");
    }

    const db = await openDatabase();
    const result = await db.runAsync(
      `INSERT INTO freezer (preyType, quantity, weight, weightType)
         VALUES (?, ?, ?, ?)`,
      [preyType, quantity, weight, weightType]
    );

    //console.log("Inserted prey, result:", result); // 🛠 Log DB result

    return result.lastInsertRowId;
  } catch (error) {
    //console.error("Error adding prey to freezer:", error);
    throw error;
  }
};

export const fetchFreezerItems = async () => {
  try {
    const db = await openDatabase();
    return await db.getAllAsync("SELECT * FROM freezer WHERE quantity > 0");
  } catch (error) {
    //console.error("Error fetching freezer items:", error);
    throw error;
  }
};

export const updateFreezerItemInDB = async (id, updatedData) => {
  try {
    const db = await openDatabase();

    await db.runAsync(
      `UPDATE freezer SET preyType = ?, quantity = ?, weight = ?, weightType = ? WHERE id = ?`,
      [
        updatedData.preyType,
        updatedData.quantity,
        updatedData.preyWeight, // ✅ Fix naming
        updatedData.preyWeightType,
        id,
      ]
    );

    // ✅ Fetch the updated item and return it
    const result = await db.getFirstAsync(
      `SELECT * FROM freezer WHERE id = ?`,
      [id]
    );

    return result; // ✅ This ensures Redux gets the latest data
  } catch (error) {
    console.error("Error updating freezer item:", error);
    throw error;
  }
};

// File: freezer.js
export const linkFeedingToFreezer = async (
  feedingId,
  freezerId,
  quantityUsed
) => {
  try {
    const db = await openDatabase();

    await db.runAsync(
      `INSERT INTO feeding_freezer (feedingId, freezerId, quantityUsed)
         VALUES (?, ?, ?);`,
      [feedingId, freezerId, quantityUsed]
    );

    // ✅ Decrement quantity in freezer table
    await db.runAsync(
      `UPDATE freezer SET quantity = quantity - ? WHERE id = ?;`,
      [quantityUsed, freezerId]
    );

    // ✅ Fetch and return the updated item
    return await db.getFirstAsync(`SELECT * FROM freezer WHERE id = ?;`, [
      freezerId,
    ]);
  } catch (error) {
    console.error("Error linking feeding to freezer:", error);
    throw error;
  }
};

export const fetchFeedingFreezerUsage = async (feedingId) => {
  try {
    const db = await openDatabase();
    const result = await db.getAllAsync(
      `SELECT ffl.*, fr.preyType, fr.preyWeight, fr.preyWeightType 
         FROM feeding_freezer_link ffl
         INNER JOIN freezer fr ON ffl.freezerId = fr.id
         WHERE ffl.feedingId = ?`,
      [feedingId]
    );
    return result;
  } catch (error) {
    //console.error("Error fetching feeding freezer usage:", error);
    throw error;
  }
};

export const deletePreyFromFreezer = async (freezerId) => {
  try {
    const db = await openDatabase();
    await db.runAsync("DELETE FROM freezer WHERE id = ?", [freezerId]);
    //console.log("Prey item deleted from freezer");
  } catch (error) {
    //console.error("Error deleting prey from freezer:", error);
    throw error;
  }
};
