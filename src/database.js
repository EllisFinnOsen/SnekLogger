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
        notes TEXT,
        complete INTEGER DEFAULT 0,
        FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
      );
    `);

    //////console("Database initialized");
  } catch (error) {
    ////console.error("Error initializing database:", error);
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

    // --- Insert sample feedings ---
    await db.execAsync(`
      INSERT INTO feedings (petId, feedingDate, feedingTime, preyType, preyWeight, notes, complete)
      VALUES
        (3, '2025-01-10', '09:00:00', 'Rat', 2.0, 'Weekly feeding', 0),
        (2, '2025-02-02', '09:00:00', 'Pig', 2.0, 'Weekly feeding', 0),
        (5, '2025-02-03', '09:00:00', 'Dog', 2.0, 'Weekly feeding', 0),
        (4, '2025-02-17', '09:00:00', 'Rat', 2.0, 'Regular feeding schedule', 1),
        (4, '2025-04-12', '10:00:00', 'Rat', 3.5, 'Fed larger prey for growth', 0),
        (5, '2025-03-18', '08:00:00', 'Mouse', 1.2, 'Feeding after growth spurt', 0),
        (6, '2025-05-11', '09:30:00', 'Veggies', 0.4, 'Added leafy greens', 1);
    `);

    ////console("Mock data inserted");
  } catch (error) {
    //console.error("Error inserting mock data:", error);
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
    return result || null;
  } catch (error) {
    ////console.error("Error fetching feeding by ID:", error);
    throw error;
  }
};

// Update feeding (e.g., feedingDate, feedingTime) in DB
export const updateFeedingInDb = async (
  feedingId,
  petId,
  feedingDate,
  feedingTime,
  complete
) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "UPDATE feedings SET petId = ?, feedingDate = ?, feedingTime = ?, complete = ? WHERE id = ?",
      [petId, feedingDate, feedingTime, complete, feedingId]
    );
    //////console("Feeding updated in DB:", result);
    return result;
  } catch (error) {
    ////console.error("Error updating feeding in DB:", error);
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
