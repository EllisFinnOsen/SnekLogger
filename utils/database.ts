import { SQLiteDatabase } from "expo-sqlite";

let dbInstance: SQLiteDatabase | null = null;

export const getDatabase = (): SQLiteDatabase => {
  if (!dbInstance) {
    throw new Error(
      "Database has not been initialized. Make sure to call `initializeDatabase` before using `getDatabase`."
    );
  }
  return dbInstance;
};

export const initializeDatabase = (database: SQLiteDatabase): void => {
  dbInstance = database;
};

// Wrapper function to run a query and return the results
export const runQuery = async (
  db: SQLiteDatabase,
  query: string,
  params: any[] = []
): Promise<any[]> => {
  try {
    const result = await db.execAsync(query, params);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

// Function to retrieve all pets
export const getAllPets = async (db: SQLiteDatabase): Promise<any[]> => {
  const query = "SELECT * FROM pets";
  return runQuery(db, query);
};

// Function to add a new pet
export const addPet = async (
  db: SQLiteDatabase,
  name: string,
  species: string,
  morph: string,
  birthDate: string,
  weight: number,
  imageURL: string
): Promise<void> => {
  const query = `
    INSERT INTO pets (name, species, morph, birthDate, weight, imageURL)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await runQuery(db, query, [
    name,
    species,
    morph,
    birthDate,
    weight,
    imageURL,
  ]);
};

// Function to get feedings based on a query
export const getFeedings = async (
  db: SQLiteDatabase,
  query: string
): Promise<any[]> => {
  return runQuery(db, query);
};
