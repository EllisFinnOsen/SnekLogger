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
    const items = await db.getAllAsync(
      "SELECT * FROM freezer WHERE quantity > 0"
    );

    return items.map((item) => ({
      ...item,
      preyType: item.preyType || "Unknown Prey", // ✅ Ensure it's never undefined
    }));
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

export const linkFeedingToFreezer = async (
  feedingId,
  freezerId,
  quantityUsed
) => {
  try {
    const db = await openDatabase();
    await db.runAsync(
      `INSERT INTO feeding_freezer (feedingId, freezerId, quantityUsed)
         VALUES (?, ?, ?)`,
      [feedingId, freezerId, quantityUsed]
    );

    // Reduce the quantity in the freezer
    const freezerItem = await db.getFirstAsync(
      "SELECT quantity FROM freezer WHERE id = ?",
      [freezerId]
    );

    if (freezerItem && freezerItem.quantity >= quantityUsed) {
      const newQuantity = freezerItem.quantity - quantityUsed;
      await updateFreezerItemInDB(freezerId, {
        ...freezerItem,
        quantity: newQuantity,
      });
    } else {
      console.warn("Not enough prey in freezer!");
    }
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
