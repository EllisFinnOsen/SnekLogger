import * as SQLite from 'expo-sqlite';

// Open or create the database
let db;
export const openDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('snake_feeding4.db');
  }
  return db;
};

// Initialize the database tables
export const initializeDatabase = async () => {
  try {
    const db = await openDatabase();
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      DROP TABLE IF EXISTS pets;
      DROP TABLE IF EXISTS feedings;

      CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS feedings (
        id INTEGER PRIMARY KEY NOT NULL,
        petId INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        FOREIGN KEY (petId) REFERENCES pets (id)
      );
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};


export const insertMockData = async () => {
  try {
    await db.runAsync('INSERT INTO pets (id, name) VALUES (?, ?)', [1, 'Python']);
    await db.runAsync('INSERT INTO pets (id, name) VALUES (?, ?)', [2, 'Boa']);

    await db.runAsync(
      'INSERT INTO feedings (id, petId, date, time) VALUES (?, ?, ?, ?)',
      [1, 1, '2025-02-01', '12:00 PM']
    );
    await db.runAsync(
      'INSERT INTO feedings (id, petId, date, time) VALUES (?, ?, ?, ?)',
      [2, 2, '2025-02-02', '1:00 PM']
    );

    console.log('Mock data inserted');
  } catch (error) {
    console.error('Error inserting mock data:', error);
  }
};







export const fetchPetsFromDb = async () => {
  const result = await db.getAllAsync('SELECT * FROM pets');
  console.log('Fetched pets from DB:', result);
  return result;
};



// Fetch feedings by petId
export const fetchFeedingsByPetFromDb = async (petId) => {
  try {
    const result = await db.getAllAsync(
      'SELECT * FROM feedings WHERE petId = ?',
      [petId]
    );
    console.log('Fetched feedings from DB:', result); // Debug
    return result;
  } catch (error) {
    console.error('Error fetching feedings:', error);
    throw error; // Re-throw the error to handle it in the calling code
  }
};

export const fetchFeedingByIdFromDb = async (feedingId) => {
  try {
    const result = await db.getFirstAsync('SELECT * FROM feedings WHERE id = ?', [feedingId]);
    return result || null;
  } catch (error) {
    console.error('Error fetching feeding by ID:', error);
    throw error;
  }
};

export const updateFeedingInDb = async (feedingId, petId, date, time) => {
  try {
    const result = await db.runAsync(
      'UPDATE feedings SET petId = ?, date = ?, time = ? WHERE id = ?',
      [petId, date, time, feedingId]
    );
    console.log('Feeding updated in DB:', result);
    return result;
  } catch (error) {
    console.error('Error updating feeding in DB:', error);
    throw error;
  }
};