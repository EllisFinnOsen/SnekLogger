import * as SQLite from "expo-sqlite";

let db;

export const openDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("mockData_1.db");
  }
  return db;
};

export const initializeDatabase = async () => {
  try {
    const db = await openDatabase();

    await db.execAsync(`
      PRAGMA journal_mode = WAL;

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
