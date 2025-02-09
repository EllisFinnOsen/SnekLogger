import { openDatabase } from "./index.js";
import { insertMockData } from "./mockData.js";

export const resetDatabase = async () => {
  try {
    const db = await openDatabase();

    //console.log("Resetting database...");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      DROP TABLE IF EXISTS pets;
      DROP TABLE IF EXISTS groups;
      DROP TABLE IF EXISTS group_pets;
      DROP TABLE IF EXISTS feedings;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS freezer;
      DROP TABLE IF EXISTS freezer_link;

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
        feedingTimestamp TEXT NOT NULL,
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

      CREATE TABLE IF NOT EXISTS freezer_link (
        feedingId INTEGER NOT NULL,
        freezerId INTEGER NOT NULL,
        quantityUsed INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (feedingId) REFERENCES feedings (id) ON DELETE CASCADE,
        FOREIGN KEY (freezerId) REFERENCES freezer (id) ON DELETE CASCADE
      );
    `);

    //console.log("Tables reset successfully. Now inserting mock data...");

    //console.log("Database reset complete with fresh mock data.");
  } catch (error) {
    //console.error("Error resetting database:", error);
  }
};
