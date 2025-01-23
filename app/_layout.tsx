import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Function to initialize the database
async function initializeDatabase(db: SQLiteDatabase) {
  // Ensure the pets table exists
  //console.log("Ensuring pets table exists...");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species TEXT,
      morph TEXT,
      birthDate TEXT,
      weight REAL,
      imageURL TEXT
    );
  `);
  //console.log("Pets table creation check completed.");

  // Ensure the feedings table exists
  //console.log("Ensuring feedings table exists...");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS feedings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      petId INTEGER NOT NULL,
      feedingDate TEXT NOT NULL,
      feedingTime TEXT NOT NULL,
      preyType TEXT NOT NULL,
      preyWeight REAL,
      notes TEXT,
      complete BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
    );
  `);
  //console.log("Feedings table creation check completed.");

  // Insert sample pets
  const existingPets: Array<{ id: number; name: string }> =
    await db.getAllAsync("SELECT * FROM pets");
  if (existingPets.length === 0) {
    //console.log("Inserting initial pets...");
    await db.execAsync(`
      INSERT INTO pets (name, birthDate, species, morph, weight, imageURL)
      VALUES 
        ('Charlie', '2020-06-15', 'Snake', 'Corn Snake', 1.2, 'https://www.awsfzoo.com/media/Corn-Snake-Website-906x580.jpg'),
        ('Max', '2019-04-10', 'Lizard', 'Leopard Gecko', 0.09, NULL),
        ('Alby', '2022-01-01', 'Snake', 'Albino Ball Python', 2.5, 'https://www.worldofballpythons.com/files/morphs/albino/014.jpg'),
        ('RedTail', '2021-05-15', 'Snake', 'Red Tail Boa', 3.8, 'https://www.thesprucepets.com/thmb/JvQXAZkK-f0DcspbhkbHhQKQfcM=/2099x0/filters:no_upscale():strip_icc()/GettyImages-10014219-56a2bd3b3df78cf772796415.jpg'),
        ('Bella', '2021-03-20', 'Snake', 'King Snake', 2.3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Scarlet_kingsnake_%28Lampropeltis_elapsoides%29.jpg/1200px-Scarlet_kingsnake_%28Lampropeltis_elapsoides%29.jpg'),
        ('Luna', '2022-07-14', 'Turtle', 'Red-Eared Slider', 1.1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIZ4Zv6ugrmLi9t6In1X7MwvQ30aSxR0jr3w&s'),
        ('Rocky', '2018-10-08', 'Lizard', 'Bearded Dragon', 0.5, 'https://betterthancrickets.com/cdn/shop/articles/b4ccc6b7-d54c-42d0-b8ba-33564cc0798a.jpg?v=1699154925'),
        ('Shadow', '2023-02-11', 'Snake', 'Black Milk Snake', 0.9, 'https://cdn11.bigcommerce.com/s-g64jf8ws/images/stencil/1280x1280/products/1940/5520/black_milk_adult__28339.1710892858.jpg?c=2');
    `);
  }

  // Insert sample feedings for each pet
  const existingFeedings: Array<{ id: number }> = await db.getAllAsync(
    "SELECT * FROM feedings"
  );
  if (existingFeedings.length === 0) {
    const pets = await db.getAllAsync("SELECT id FROM pets");
    for (const pet of pets) {
      await db.execAsync(`
        INSERT INTO feedings (petId, feedingDate, feedingTime, preyType, preyWeight, notes, complete)
        VALUES
          (${pet.id}, '2025-01-01', '08:00:00', 'Mouse', 1.5, 'First feeding of the year', FALSE),
          (${pet.id}, '2025-01-15', '08:00:00', 'Rat', 2.0, 'Increased size for growth', FALSE);
      `);
    }
  }

  // Ensure the groups table exists
  //console.log("Ensuring groups table exists...");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      notes TEXT
    );
  `);
  //console.log("Groups table creation check completed.");

  // Ensure the group_pets table exists
  //console.log("Ensuring group_pets table exists...");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS group_pets (
      groupId INTEGER NOT NULL,
      petId INTEGER NOT NULL,
      PRIMARY KEY (groupId, petId),
      FOREIGN KEY (groupId) REFERENCES groups (id) ON DELETE CASCADE,
      FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
    );
  `);
  //console.log("Group-pets table creation check completed.");

  // Insert sample groups
  const existingGroups: Array<{ id: number; name: string }> =
    await db.getAllAsync("SELECT * FROM groups");
  if (existingGroups.length === 0) {
    console.log("Inserting initial groups...");
    await db.execAsync(`
      INSERT INTO groups (name, notes)
      VALUES
        ('Reptile Club', 'Group of reptiles with different morphs'),
        ('Beginner Pets', 'Good pets for beginners');
    `);
  }

  // Add sample pet-to-group assignments using INSERT OR IGNORE
  //console.log("Assigning pets to groups...");
  await db.execAsync(`
    INSERT OR IGNORE INTO group_pets (groupId, petId)
    VALUES 
      (1, 1),  -- Charlie in Reptile Club
      (1, 2),  -- Max in Reptile Club
      (1, 6),  -- Luna in Reptile Club
      (1, 7),  -- Rocky in Reptile Club
      (2, 3),  -- Alby in Beginner Pets
      (2, 4),  -- RedTail in Beginner Pets
      (2, 5);  -- Bella in Beginner Pets
  `);
  //console.log("Pets assigned to groups.");

  // Query and log the groups along with their pets
  const groupMemberships = await db.getAllAsync(`
    SELECT g.name AS groupName, p.name AS petName
    FROM groups g
    INNER JOIN group_pets gp ON g.id = gp.groupId
    INNER JOIN pets p ON p.id = gp.petId
  `);
  //console.log("Group memberships:", groupMemberships);

  // Query and log all feedings
  const allFeedings = await db.getAllAsync("SELECT * FROM feedings");
  //console.log("All feedings in the database:", allFeedings);

  //console.log("Database initialization completed.");
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    OutfitReg: require("../assets/fonts/Outfit-Regular.ttf"),
    OutfitMed: require("../assets/fonts/Outfit-SemiBold.ttf"),
    OutfitBold: require("../assets/fonts/Outfit-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="petTracker9.db" onInit={initializeDatabase}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SQLiteProvider>
  );
}
