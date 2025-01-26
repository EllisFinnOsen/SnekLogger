import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

export const loadDatabase = async () => {
  const dbName = "petTracker.db";
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  try {
    const db = await SQLite.openDatabaseAsync(dbName);


    // Set WAL mode and create tables
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

    console.log("Database initialized successfully");
    return true;

  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};
