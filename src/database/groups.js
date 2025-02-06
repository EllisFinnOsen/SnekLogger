import { openDatabase } from "./index.js";

// Fetch all groups
export const getGroupsFromDb = async () => {
  try {
    const db = await openDatabase();
    const result = await db.getAllAsync("SELECT * FROM groups");
    ////console("Fetched groups from DB:", result); // This will log the groups.
    return result;
  } catch (error) {
    //console.error("Error fetching groups from DB:", error);
    throw error;
  }
};

export const fetchPetsByGroupIdFromDb = async (groupId) => {
  try {
    const db = await openDatabase();
    const result = await db.getAllAsync(
      `SELECT pets.* FROM pets
       INNER JOIN group_pets ON pets.id = group_pets.petId
       WHERE group_pets.groupId = ?`,
      [groupId]
    );

    ////console(`Fetched pets for group ${groupId}:`, result);

    if (!Array.isArray(result)) {
      //console.error(`Expected an array but got:`, result);
      return [];
    }

    return result;
  } catch (error) {
    //console.error(`Error fetching pets for group ${groupId}:`, error);
    return []; // Always return an array to avoid breaking `.map()`
  }
};

export const addPetToGroup = async (groupId, petId) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "INSERT INTO group_pets (groupId, petId) VALUES (?, ?)",
      [groupId, petId]
    );
    return result;
  } catch (error) {
    //console.error("Error adding pet to group:", error);
    throw error;
  }
};

export const fetchGroupsForPetFromDb = async (petId) => {
  try {
    const db = await openDatabase();
    // First, get the group IDs for the given pet from group_pets
    const groupRows = await db.getAllAsync(
      "SELECT groupId FROM group_pets WHERE petId = ?",
      [petId]
    );
    const groupIds = groupRows.map((row) => row.groupId);
    if (groupIds.length === 0) return [];
    // Then, fetch the full group objects using an IN clause.
    // (Make sure groupIds are numbers.)
    const groups = await db.getAllAsync(
      `SELECT * FROM groups WHERE id IN (${groupIds.join(",")})`
    );
    return groups;
  } catch (error) {
    //console.error("Error fetching groups for pet:", error);
    return [];
  }
};

export const removePetFromGroup = async (groupId, petId) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "DELETE FROM group_pets WHERE groupId = ? AND petId = ?",
      [groupId, petId]
    );
    return result;
  } catch (error) {
    //console.error("Error removing pet from group:", error);
    throw error;
  }
};

export const addGroupToDb = async (group) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      `INSERT INTO groups (name, notes) VALUES (?, ?)`,
      [group.name, group.notes]
    );
    return result.lastInsertRowId; // Return the new group's ID.
  } catch (error) {
    console.error("Error adding group to database:", error);
    throw error;
  }
};

export const updateGroupToDb = async (group) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      `UPDATE groups SET name = ?, notes = ? WHERE id = ?`,
      [group.name, group.notes, group.id]
    );
    return result;
  } catch (error) {
    console.error("Error updating group in DB:", error);
    throw error;
  }
};

export const deleteGroupFromDb = async (groupId) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync("DELETE FROM groups WHERE id = ?", [
      groupId,
    ]);
    return result;
  } catch (error) {
    console.error("Error deleting group from DB:", error);
    throw error;
  }
};
