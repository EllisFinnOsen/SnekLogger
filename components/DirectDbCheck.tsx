import * as SQLite from "expo-sqlite";
import { useEffect } from "react";

export default function DirectDbCheck() {
  useEffect(() => {
    async function checkDatabase() {
      try {
        // Open the database directly
        const db = await SQLite.openDatabaseAsync("petTracker_initial.db");

        // Check SQLite version
        const version = await db.getFirstAsync<{ sqlite_version: string }>(
          "SELECT sqlite_version() AS sqlite_version"
        );
        console.log("SQLite version:", version.sqlite_version);

        // List all tables
        const tables = await db.getAllAsync<{ name: string }>(
          "SELECT name FROM sqlite_master WHERE type='table'"
        );
        console.log(
          "Tables in database:",
          tables.map((t) => t.name)
        );

        // Verify if the pets table exists
        const pets = await db.getAllAsync("SELECT * FROM pets");
        console.log("Pets table data:", pets);
      } catch (error) {
        console.error("Direct database check failed:", error);
      }
    }

    checkDatabase();
  }, []);

  return null;
}
