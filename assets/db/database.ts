import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

export const loadDatabase = async () => {
  const dbName = "petTracker.db";
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  try {
    const db = await SQLite.openDatabaseAsync(dbName);

    // Drop existing tables and recreate (for testing purposes; remove in production)
    // await db.execAsync(`
    //   DROP TABLE IF EXISTS feedings;
    //   DROP TABLE IF EXISTS pets;
    //   DROP TABLE IF EXISTS groups;
    //   DROP TABLE IF EXISTS group_pets;
    // `);

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

    // Insert sample pets
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
        ('Shadow', 'Snake', 'Black Milk Snake', '2023-02-11', 0.9, 'https://cdn11.bigcommerce.com/s-g64jf8ws/images/stencil/1280x1280/products/1940/5520/black_milk_adult__28339.1710892858.jpg?c=2');
    `);

    // Insert sample groups
    await db.execAsync(`
      INSERT INTO groups (name, notes)
      VALUES 
        ('Upstairs Room', 'Pets kept in the upstairs reptile room.'),
        ('Lizards', 'All lizards including geckos and bearded dragons.'),
        ('Snakes', 'All snakes including ball pythons and boas.'),
        ('Turtle Pond', 'All aquatic turtles kept in the indoor pond setup.'),
        ('Beginner Reptiles', 'Easier reptiles for new collectors.');
    `);

    // Map pets to groups
    await db.execAsync(`
      INSERT INTO group_pets (groupId, petId)
      VALUES 
        (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
        (2, 2), (2, 7),
        (3, 1), (3, 3), (3, 4), (3, 5), (3, 8),
        (4, 6),
        (5, 2), (5, 7), (5, 6);
    `);

    // Insert sample feedings
    await db.execAsync(`
      INSERT INTO feedings (petId, feedingDate, feedingTime, preyType, preyWeight, notes, complete)
      VALUES
        (3, '2025-01-10', '09:00:00', 'Rat', 2.0, 'Weekly feeding', 1),
        (3, '2025-01-17', '09:00:00', 'Rat', 2.0, 'Regular feeding schedule', 1),
        (4, '2025-01-12', '10:00:00', 'Rat', 3.5, 'Fed larger prey for growth', 0),
        (1, '2025-01-18', '08:00:00', 'Mouse', 1.2, 'Feeding after growth spurt', 0),
        (6, '2025-01-11', '09:30:00', 'Veggies', 0.4, 'Added leafy greens', 1);
    `);

    console.log("Database initialized successfully");
    return true;

  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};
