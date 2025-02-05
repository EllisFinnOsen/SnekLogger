import * as SQLite from "expo-sqlite";

// In-memory reference to the DB once opened
let db;

export const openDatabase = async () => {
  if (!db) {
    // Open or create the database file
    db = await SQLite.openDatabaseAsync("mockData_1.db");
  }
  return db;
};

export const initializeDatabase = async () => {
  try {
    const db = await openDatabase();

    // Create tables if they don't exist (adding the new 'category' column to pets)

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      DROP TABLE IF EXISTS pets;
      DROP TABLE IF EXISTS groups;
      DROP TABLE IF EXISTS group_pets;
      DROP TABLE IF EXISTS feedings;
      DROP TABLE IF EXISTS users;
      

      CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        species TEXT,
        morph TEXT,
        birthDate TEXT,
        weight REAL,
        weightType TEXT,
        imageURL TEXT
      );

      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        notes TEXT
      );


      CREATE TABLE IF NOT EXISTS group_pets (
        groupId INTEGER NOT NULL,
        petId INTEGER NOT NULL,
        FOREIGN KEY (groupId) REFERENCES groups (id) ON DELETE CASCADE,
        FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS feedings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        petId INTEGER NOT NULL,
        feedingDate TEXT NOT NULL,
        feedingTime TEXT NOT NULL,
        preyType TEXT NOT NULL,
        preyWeight REAL,
        preyWeightType TEXT NOT NULL,
        notes TEXT,
        complete INTEGER DEFAULT 0,
        FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
      );
    
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY CHECK (id = 1), 
        name TEXT NOT NULL,
        photo TEXT,
        birthdate TEXT
      );

      CREATE TABLE IF NOT EXISTS freezer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        preyType TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        weight REAL,
        weightType TEXT
      );

      CREATE TABLE IF NOT EXISTS feeding_freezer (
        feedingId INTEGER NOT NULL,
        freezerId INTEGER NOT NULL,
        quantityUsed INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (feedingId) REFERENCES feedings (id) ON DELETE CASCADE,
        FOREIGN KEY (freezerId) REFERENCES freezer (id) ON DELETE CASCADE
      );



    `);

    console.log("Database initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export const insertMockData = async () => {
  try {
    const db = await openDatabase();

    // --- Insert sample pets with the new category field ---
    await db.runAsync(
      `INSERT INTO pets (name, category, species, morph, birthDate, weight, weightType, imageURL)
       VALUES
        ('Charlie', 'Snakes', 'Corn Snake', 'Normal', '2020-06-15', 1.2, 'g', 'https://www.awsfzoo.com/media/Corn-Snake-Website-906x580.jpg'),
        ('Max', 'Lizards', 'Leopard Gecko', 'Normal', '2019-04-10', 0.09, 'g', NULL),
        ('Alby', 'Snakes', 'Ball Python', 'Albino', '2022-01-01', 2.5, 'g', 'https://www.worldofballpythons.com/files/morphs/albino/014.jpg')
      `
    );

    // --- Insert sample groups ---
    await db.runAsync(
      `INSERT INTO groups (name, notes)
       VALUES
        ('Upstairs Room', 'Pets kept in the upstairs reptile room.'),
        ('Lizards', 'All lizards including geckos and bearded dragons.')
      `
    );

    // --- Map pets to groups ---
    await db.runAsync(
      `INSERT INTO group_pets (groupId, petId) 
       VALUES 
        (1, 1), (1, 2), (2, 3)
      `
    );

    // --- Insert sample feedings ---
    await db.runAsync(
      `INSERT INTO feedings (petId, feedingDate, feedingTime, preyType, preyWeight, preyWeightType, notes, complete)
       VALUES
        (3, '2025-01-10', '09:00:00', 'Rat', 2.0, 'g', 'Weekly feeding', 0),
        (2, '2025-02-02', '09:00:00', 'Pig', 2.0, 'g', 'Weekly feeding', 1)
      `
    );

    // --- Insert user profile (Fixed) ---
    await db.runAsync(
      `INSERT INTO users (id, name, photo, birthdate)
       VALUES (1, 'Ellis', 'https://avatars.githubusercontent.com/u/15618526?v=4', '1990-05-11')
       ON CONFLICT(id) DO UPDATE SET 
         name = excluded.name,
         photo = excluded.photo,
         birthdate = excluded.birthdate
      `
    );

    // --- Insert sample freezer items ---
    await db.runAsync(
      `INSERT INTO freezer (preyType, quantity, weight, weightType)
       VALUES
        ('Rat', 10, 2.0, 'g'),
        ('Mouse', 15, 1.5, 'g'),
        ('Chick', 8, 3.0, 'g')
      `
    );

    // --- Link feedings to freezer items and reduce stock ---
    await db.runAsync(
      `INSERT INTO feeding_freezer (feedingId, freezerId, quantityUsed)
       VALUES
        (1, 1, 1),  -- Alby ate 1 Rat
        (2, 2, 2)   -- Max ate 2 Mice
      `
    );

    // --- Reduce stock in freezer ---
    await db.runAsync(
      `UPDATE freezer SET quantity = quantity - 1 WHERE id = 1`
    );
    await db.runAsync(
      `UPDATE freezer SET quantity = quantity - 2 WHERE id = 2`
    );

    console.log("Mock data inserted successfully.");
  } catch (error) {
    console.error("Error inserting mock data:", error);
  }
};

// File: database.js
export const fetchUserProfileFromDb = async () => {
  try {
    const db = await openDatabase();
    const result = await db.getFirstAsync("SELECT * FROM users");
    return result || { name: "", photo: "", birthdate: "" }; // Default values
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfileInDb = async (user) => {
  try {
    const db = await openDatabase();
    await db.runAsync(
      `INSERT INTO users (id, name, photo, birthdate)
       VALUES (1, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET 
         name = excluded.name,
         photo = excluded.photo,
         birthdate = excluded.birthdate;`,
      [user.name, user.photo, user.birthdate]
    );
  } catch (error) {
    console.error("Error updating user profile in DB:", error);
    throw error;
  }
};

// -------------------- Fetching and Updating --------------------

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
  notes, // Include notes
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
        notes ?? "", // Ensure notes are never undefined
        complete ?? 0,
        feedingId,
      ]
    );
    return result;
  } catch (error) {
    console.error("Error updating feeding in DB:", error);
    throw error;
  }
};

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

export const deletePetFromDb = async (petId) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync("DELETE FROM pets WHERE id = ?", [petId]);
    return result;
  } catch (error) {
    console.error("Error deleting pet from DB:", error);
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

export const updateFreezerItem = async (id, quantity) => {
  try {
    const db = await openDatabase();
    await db.runAsync(`UPDATE freezer SET quantity = ? WHERE id = ?`, [
      quantity,
      id,
    ]);
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
      await updateFreezerItem(freezerId, newQuantity);
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
