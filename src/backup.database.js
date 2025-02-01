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

    //feeding//console.log("Database initialized");
  } catch (error) {
    //feeding//console.error("Error initializing database:", error);
  }
};

export const insertMockData = async () => {
  try {
    const db = await openDatabase();

    // --- Insert sample pets ---
    await db.execAsync(`
      INSERT INTO pets (name, species, morph, birthDate, weight, imageURL)
      VALUES
        ('Charlie', 'Snake', 'Corn Snake', '2020-06-15', 1.2, 'https://www.awsfzoo.com/media/Corn-Snake-Website-906x580.jpg'),
        ('Max', 'Lizard', 'Leopard Gecko', '2019-04-10', 0.09, NULL),
        ('Alby', 'Snake', 'Albino Ball Python', '2022-01-01', 2.5, 'https://www.worldofballpythons.com/files/morphs/albino/014.jpg'),
        ('RedTail', 'Snake', 'Red Tail Boa', '2021-05-15', 3.8, 'https://www.thesprucepets.com/thmb/JvQXAZkK-f0DcspbhkbHhQKQfcM=/2099x0/filters:no_upscale():strip_icc()/GettyImages-10014219-56a2bd3b3df78cf772796415.jpg'),
        ('Bella', 'Snake', 'King Snake', '2021-03-20', 2.3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Scarlet_kingsnake_%28Lampropeltis_elapsoides%29.jpg/1200px-Scarlet_kingsnake_%28Lampropeltis_elapsoides%29.jpg'),
        ('Luna', 'Turtle', 'Red-Eared Slider', '2022-07-14', 1.1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIZ4Zv6ugrmLi9t6In1X7MwvQ30aSxR0jr3w&s'),
        ('Rocky', 'Lizard', 'Bearded Dragon', '2018-10-08', 0.5, 'https://betterthancrickets.com/cdn/shop/articles/b4ccc6b7-d54c-42d0-b8ba-33564cc0798a.jpg?v=1699154925'),
        ('Shadow', 'Snake', 'Black Milk Snake', '2023-02-11', 0.9, 'https://cdn11.bigcommerce.com/s-g64jf8ws/images/stencil/1280x1280/products/1940/5520/black_milk_adult__28339.1710892858.jpg?c=2')
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
        (3, '2025-01-10', '09:00:00', 'Rat', 2.0, 'Weekly feeding', 1),
        (3, '2025-02-17', '09:00:00', 'Rat', 2.0, 'Regular feeding schedule', 1),
        (4, '2025-04-12', '10:00:00', 'Rat', 3.5, 'Fed larger prey for growth', 0),
        (1, '2025-03-18', '08:00:00', 'Mouse', 1.2, 'Feeding after growth spurt', 0),
        (6, '2025-05-11', '09:30:00', 'Veggies', 0.4, 'Added leafy greens', 1);
    `);

    //feeding//console.log("Mock data inserted");
  } catch (error) {
    //feeding//console.error("Error inserting mock data:", error);
  }
};

// -------------------- Fetching and Updating --------------------

// Fetch all pets
export const fetchPetsFromDb = async () => {
  try {
    const db = await openDatabase();
    const result = await db.getAllAsync("SELECT * FROM pets");
    //feeding//console.log("Fetched pets from DB:", result);
    return result;
  } catch (error) {
    //feeding//console.error("Error fetching pets:", error);
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
    //feeding//console.log("Fetched feedings from DB:", result);
    return result;
  } catch (error) {
    //feeding//console.error("Error fetching feedings:", error);
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
    //feeding//console.error("Error fetching feeding by ID:", error);
    throw error;
  }
};

// Update feeding (e.g., feedingDate, feedingTime) in DB
export const updateFeedingInDb = async (
  feedingId,
  petId,
  feedingDate,
  feedingTime
) => {
  try {
    const db = await openDatabase();
    const result = await db.runAsync(
      "UPDATE feedings SET petId = ?, feedingDate = ?, feedingTime = ? WHERE id = ?",
      [petId, feedingDate, feedingTime, feedingId]
    );
    //feeding//console.log("Feeding updated in DB:", result);
    return result;
  } catch (error) {
    //feeding//console.error("Error updating feeding in DB:", error);
    throw error;
  }
};
