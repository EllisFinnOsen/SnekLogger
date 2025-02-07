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

    console.log("Adding prey to DB:", {
      preyType,
      quantity,
      weight,
      weightType,
    }); // 🛠 Log before DB call

    const db = await openDatabase();
    const result = await db.runAsync(
      `INSERT INTO freezer (preyType, quantity, weight, weightType)
         VALUES (?, ?, ?, ?)`,
      [preyType, quantity, weight, weightType]
    );

    console.log("Inserted prey, result:", result); // 🛠 Log DB result

    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error adding prey to freezer:", error);
    throw error;
  }
};

export const fetchFreezerItems = async () => {
  try {
    const db = await openDatabase();
    return await db.getAllAsync("SELECT * FROM freezer WHERE quantity > 0");
  } catch (error) {
    console.error("Error fetching freezer items:", error);
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
        updatedData.weight,
        updatedData.weightType,
        id,
      ]
    );

    // Fetch and return the updated item
    const result = await db.getFirstAsync(
      `SELECT * FROM freezer WHERE id = ?`,
      [id]
    );

    return result; // Return updated object
  } catch (error) {
    console.error("Error updating freezer item:", error);
    throw error;
  }
};

export const linkFeedingToFreezer = async (feedingId, freezerId) => {
  try {
    const db = await openDatabase();
    await db.runAsync(
      `INSERT INTO freezer_link (feedingId, freezerId) VALUES (?, ?);`,
      [feedingId, freezerId]
    );
    console.log(`Linked Feeding ${feedingId} to Freezer Item ${freezerId}`);
  } catch (error) {
    console.error("Error linking feeding to freezer:", error);
  }
};

export const fetchFeedingFreezerUsage = async (feedingId) => {
  try {
    const db = await openDatabase();
    const result = await db.getAllAsync(
      `SELECT ffl.*, fr.preyType, fr.preyWeight, fr.preyWeightType 
         FROM freezer_link_link ffl
         INNER JOIN freezer fr ON ffl.freezerId = fr.id
         WHERE ffl.feedingId = ?`,
      [feedingId]
    );
    return result;
  } catch (error) {
    console.error("Error fetching feeding freezer usage:", error);
    throw error;
  }
};

export const deletePreyFromFreezer = async (freezerId) => {
  try {
    const db = await openDatabase();
    await db.runAsync("DELETE FROM freezer WHERE id = ?", [freezerId]);
    console.log("Prey item deleted from freezer");
  } catch (error) {
    console.error("Error deleting prey from freezer:", error);
    throw error;
  }
};

export const updateFreezerQuantityBasedOnFeeding = async (
  feedingId,
  isComplete
) => {
  try {
    const db = await openDatabase();

    // Fetch the linked freezer item
    const result = await db.getFirstAsync(
      `SELECT fr.id, fr.quantity FROM freezer_link fl
       INNER JOIN freezer fr ON fl.freezerId = fr.id
       WHERE fl.feedingId = ?`,
      [feedingId]
    );

    if (!result) {
      console.log(`No freezer item linked to Feeding ID: ${feedingId}`);
      return;
    }

    const { id: freezerId, quantity } = result;
    const newQuantity = isComplete ? quantity + 1 : quantity - 1;

    if (newQuantity < 0) {
      console.warn(
        `Freezer quantity cannot be negative for Freezer ID: ${freezerId}`
      );
      return;
    }

    // Update the freezer quantity
    await db.runAsync(`UPDATE freezer SET quantity = ? WHERE id = ?`, [
      newQuantity,
      freezerId,
    ]);

    console.log(
      `Updated freezer quantity for Freezer ID: ${freezerId}, New Quantity: ${newQuantity}`
    );
  } catch (error) {
    console.error("Error updating freezer quantity based on feeding:", error);
  }
};
