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

    // Create tables if they don't exist
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        species TEXT,
        morph TEXT,
        birthDate TEXT,
        weight REAL,
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

    console.log("Database initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// -------------------- Fetching and Updating --------------------

// Fetch all pets
export const fetchPetsFromDb = async () => {
  try {
    const db = await openDatabase();
    const result = await db.getAllAsync("SELECT * FROM pets");
    console.log("Fetched pets from DB:", result);
    return result;
  } catch (error) {
    console.error("Error fetching pets:", error);
    throw error;
  }
};

// Fetch feedings by petId
export const fetchFeedingsByPetFromDb = async (petId) => {
  try {
    const db = await openDatabase();
    const result = await db.getAllAsync(
      "SELECT * FROM feedings WHERE petId = ?",
      [petId]
    );
    console.log("Fetched feedings from DB:", result);
    return result;
  } catch (error) {
    console.error("Error fetching feedings:", error);
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
  complete
) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "UPDATE feedings SET petId = ?, feedingDate = ?, feedingTime = ?, complete = ? WHERE id = ?",
      [petId, feedingDate, feedingTime, complete, feedingId]
    );
    console.log("Feeding updated in DB:", result);
    return result;
  } catch (error) {
    console.error("Error updating feeding in DB:", error);
    throw error;
  }
};
