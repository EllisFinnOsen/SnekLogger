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

    // Create tables if they don't exist (dropping any old versions for testing)
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      DROP TABLE IF EXISTS pets;
      DROP TABLE IF EXISTS groups;
      DROP TABLE IF EXISTS group_pets;
      DROP TABLE IF EXISTS feedings;
      DROP TABLE IF EXISTS feeding_schedules;

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

      -- Updated feedings table now has isRecurring and scheduleId columns
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
        isRecurring INTEGER DEFAULT 0,
        scheduleId INTEGER,
        FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE,
        FOREIGN KEY (scheduleId) REFERENCES feeding_schedules (id)
      );

      -- Updated feeding_schedules table with individual recurrence fields
      CREATE TABLE IF NOT EXISTS feeding_schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        petId INTEGER NOT NULL,
        startDate TEXT NOT NULL,
        feedingTime TEXT NOT NULL,
        preyType TEXT,
        preyWeight REAL,
        notes TEXT,
        frequency TEXT NOT NULL,         -- e.g. 'daily', 'weekly', 'monthly', 'yearly', 'custom'
        interval INTEGER DEFAULT 1,        -- e.g. every 2 weeks (when frequency is 'weekly' and interval = 2)
        customUnit TEXT,                   -- used if frequency is custom (e.g. 'day', 'week', etc.)
        endType TEXT DEFAULT 'never',      -- 'never', 'on', or 'after'
        endDate TEXT,                      -- if endType is 'on'
        occurrenceCount INTEGER,           -- if endType is 'after'
        active INTEGER DEFAULT 1
      );
    `);

    //console.log("Database initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export const insertMockData = async () => {
  try {
    const db = await openDatabase();

    // --- Insert sample pets with the new category field ---
    await db.execAsync(`
      INSERT INTO pets (name, category, species, morph, birthDate, weight, weightType, imageURL)
      VALUES
        ('Charlie', 'Snakes', 'Corn Snake', 'Normal', '2020-06-15', 1.2, 'g', 'https://www.awsfzoo.com/media/Corn-Snake-Website-906x580.jpg'),
        ('Max', 'Lizards', 'Leopard Gecko', 'Normal', '2019-04-10', 0.09, 'g', NULL),
        ('Alby', 'Snakes', 'Ball Python', 'Albino', '2022-01-01', 2.5, 'g', 'https://www.worldofballpythons.com/files/morphs/albino/014.jpg'),
        ('RedTail', 'Snakes', 'Red Tail Boa', 'Normal', '2021-05-15', 3.8, 'g', 'https://www.thesprucepets.com/thmb/JvQXAZkK-f0DcspbhkbHhQKQfcM=/2099x0/filters:no_upscale():strip_icc()/GettyImages-10014219-56a2bd3b3df78cf772796415.jpg'),
        ('Bella', 'Snakes', 'King Snake', 'Normal', '2021-03-20', 2.3, 'g', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Scarlet_kingsnake_%28Lampropeltis_elapsoides%29.jpg/1200px-Scarlet_kingsnake_%28Lampropeltis_elapsoides%29.jpg'),
        ('Luna', 'Turtles', 'Red-Eared Slider', 'Normal', '2022-07-14', 1.1, 'g', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIZ4Zv6ugrmLi9t6In1X7MwvQ30aSxR0jr3w&s'),
        ('Rocky', 'Lizards', 'Bearded Dragon', 'Normal', '2018-10-08', 0.5, 'g', 'https://betterthancrickets.com/cdn/shop/articles/b4ccc6b7-d54c-42d0-b8ba-33564cc0798a.jpg?v=1699154925'),
        ('Shadow', 'Snakes', 'Milk Snake', 'Black', '2023-02-11', 0.9, 'g', 'https://cdn11.bigcommerce.com/s-g64jf8ws/images/stencil/1280x1280/products/1940/5520/black_milk_adult__28339.1710892858.jpg?c=2')
    `);

    // --- Insert sample groups ---
    await db.execAsync(`
      INSERT INTO groups (name, notes)
      VALUES
        ('Upstairs Room', 'Pets kept in the upstairs reptile room.'),
        ('Lizards', 'All lizards including geckos and bearded dragons.'),
        ('Snakes', 'All snakes including ball pythons and boas.'),
        ('Turtle Pond', 'All aquatic turtles kept in the indoor pond setup.'),
        ('Beginner Reptiles', 'Easier reptiles for new collectors.');
    `);

    // --- Map pets to groups (group_pets) ---
    await db.execAsync(`
      INSERT INTO group_pets (groupId, petId)
      VALUES 
        (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
        (2, 2), (2, 7),
        (3, 1), (3, 3), (3, 4), (3, 5), (3, 8),
        (4, 6),
        (5, 2), (5, 7), (5, 6);
    `);

    // --- Insert sample (one-off) feedings ---
    await db.execAsync(`
      INSERT INTO feedings (petId, feedingDate, feedingTime, preyType, preyWeight, preyWeightType, notes, complete, isRecurring)
      VALUES
        (3, '2025-01-10', '09:00:00', 'Rat', 2.0, 'g', 'Weekly feeding', 0, 0),
        (2, '2025-02-02', '09:00:00', 'Pig', 2.0, 'g', 'Weekly feeding', 0, 0),
        (5, '2025-02-03', '09:00:00', 'Dog', 2.0, 'g', 'Weekly feeding', 0, 0),
        (4, '2025-02-17', '09:00:00', 'Rat', 2.0, 'g', 'Regular feeding schedule', 1, 0),
        (4, '2025-04-12', '10:00:00', 'Rat', 3.5, 'g', 'Fed larger prey for growth', 0, 0),
        (5, '2025-03-18', '08:00:00', 'Mouse', 1.2, 'g', 'Feeding after growth spurt', 0, 0),
        (6, '2025-05-11', '09:30:00', 'Veggies', 0.4, 'g', 'Added leafy greens', 1, 0);
    `);

    // --- Insert sample recurring feeding schedules ---
    // (For testing purposes, we assume these are the first two schedule rows,
    // so their IDs will be 1 and 2 respectively.)
    await db.execAsync(`
      INSERT INTO feeding_schedules 
        (petId, startDate, feedingTime, preyType, preyWeight, notes, frequency, interval, customUnit, endType, endDate, occurrenceCount)
      VALUES
        (3, '2025-01-15', '09:00:00', 'Rat', 2.0, 'Recurring weekly feeding', 'weekly', 1, NULL, 'never', NULL, NULL),
        (2, '2025-02-05', '10:00:00', 'Mouse', 1.2, 'Recurring daily feeding', 'daily', 1, NULL, 'after', NULL, 5);
    `);

    // --- Insert sample feedings that are generated from recurring schedules ---
    // (These rows include the isRecurring flag and a scheduleId reference.)
    await db.execAsync(`
      INSERT INTO feedings (petId, feedingDate, feedingTime, preyType, preyWeight, preyWeightType, notes, complete, isRecurring, scheduleId)
      VALUES
        (3, '2025-01-15', '09:00:00', 'Rat', 2.0, 'g', 'Generated from recurring schedule', 0, 1, 1),
        (2, '2025-02-05', '10:00:00', 'Mouse', 1.2, 'g', 'Generated from recurring schedule', 0, 1, 2);
    `);

    //console.log("Mock data inserted");
  } catch (error) {
    console.error("Error inserting mock data:", error);
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
        notes: "",
        complete: 0,
        isRecurring: 0, // Default as one-off feeding
        scheduleId: null, // No schedule reference for one-off feedings
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
  complete,
  isRecurring, // New: 0 for one-off, 1 for recurring
  scheduleId // New: reference to a feeding_schedules row (or null)
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
           complete = ?,
           isRecurring = ?,
           scheduleId = ?
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
        isRecurring ?? 0,
        scheduleId ?? null,
        feedingId,
      ]
    );
    console.log("updateFeedingInDb: result =", result);
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
    console.log("insertFeedingInDb: result =", result);
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

// Insert a new feeding schedule into the database
export const insertFeedingScheduleInDb = async (schedule) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      `INSERT INTO feeding_schedules 
         (petId, startDate, feedingTime, preyType, preyWeight, notes, frequency, interval, customUnit, endType, endDate, occurrenceCount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        schedule.petId,
        schedule.startDate,
        schedule.feedingTime,
        schedule.preyType ?? "",
        schedule.preyWeight ?? 0,
        schedule.notes ?? "",
        schedule.frequency,
        schedule.interval ?? 1,
        schedule.customUnit ?? null,
        schedule.endType ?? "never",
        schedule.endDate ?? null,
        schedule.occurrenceCount ?? null,
      ]
    );
    console.log("insertFeedingScheduleInDb result:", result);
    return result.lastInsertRowId; // Make sure this is returned
  } catch (error) {
    console.error("Error inserting feeding schedule in DB:", error);
    throw error;
  }
};

// Fetch all feeding schedules for a specific pet
export const fetchFeedingSchedulesByPetIdFromDb = async (petId) => {
  try {
    const db = await openDatabase();
    const result = await db.getAllAsync(
      "SELECT * FROM feeding_schedules WHERE petId = ?",
      [petId]
    );
    return result;
  } catch (error) {
    console.error("Error fetching feeding schedules for petId:", petId, error);
    throw error;
  }
};

// Fetch a single feeding schedule by its ID
export const fetchFeedingScheduleByIdFromDb = async (scheduleId) => {
  try {
    const db = await openDatabase();
    const result = await db.getFirstAsync(
      "SELECT * FROM feeding_schedules WHERE id = ?",
      [scheduleId]
    );
    return result;
  } catch (error) {
    console.error("Error fetching feeding schedule by ID:", error);
    throw error;
  }
};

// Update an existing feeding schedule in the database
export const updateFeedingScheduleInDb = async (
  scheduleId,
  {
    petId,
    startDate,
    feedingTime,
    preyType,
    preyWeight,
    notes,
    frequency,
    interval,
    customUnit,
    endType,
    endDate,
    occurrenceCount,
  }
) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      `UPDATE feeding_schedules
         SET petId = ?,
             startDate = ?,
             feedingTime = ?,
             preyType = ?,
             preyWeight = ?,
             notes = ?,
             frequency = ?,
             interval = ?,
             customUnit = ?,
             endType = ?,
             endDate = ?,
             occurrenceCount = ?
         WHERE id = ?`,
      [
        petId,
        startDate,
        feedingTime,
        preyType ?? "",
        preyWeight ?? 0,
        notes ?? "",
        frequency,
        interval ?? 1,
        customUnit ?? null,
        endType ?? "never",
        endDate ?? null,
        occurrenceCount ?? null,
        scheduleId,
      ]
    );
    return result;
  } catch (error) {
    console.error("Error updating feeding schedule in DB:", error);
    throw error;
  }
};

// Delete a feeding schedule from the database
export const deleteFeedingScheduleFromDb = async (scheduleId) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "DELETE FROM feeding_schedules WHERE id = ?",
      [scheduleId]
    );
    return result;
  } catch (error) {
    console.error("Error deleting feeding schedule from DB:", error);
    throw error;
  }
};

export const fetchAllFeedingsFromDb = async () => {
  try {
    const db = await openDatabase();
    const result = await db.getAllAsync("SELECT * FROM feedings");
    return result;
  } catch (error) {
    console.error("Error fetching all feedings from DB:", error);
    throw error;
  }
};
