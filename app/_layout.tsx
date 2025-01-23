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
import { SQLiteDatabase, SQLiteProvider, useSQLiteContext } from "expo-sqlite";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Function to initialize the database
async function initializeDatabase(db: SQLiteDatabase) {
  // Ensure the pets table exists
  console.log("Ensuring pets table exists...");
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
  console.log("Pets table creation check completed.");

  // Ensure the feedings table exists
  console.log("Ensuring feedings table exists...");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS feedings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      petId INTEGER NOT NULL,
      feedingDate TEXT NOT NULL,
      preyType TEXT NOT NULL,
      preyWeight REAL,
      notes TEXT,
      complete BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
    );
  `);
  console.log("Feedings table creation check completed.");

  // Insert sample pets
  const existingPets: Array<{ id: number; name: string }> =
    await db.getAllAsync("SELECT * FROM pets");
  if (existingPets.length === 0) {
    await db.execAsync(`
      INSERT INTO pets (name, birthDate, species, morph, weight, imageURL)
      VALUES 
        ('Charlie', '2020-06-15', 'Snake', 'Corn Snake', 1.2, 'https://www.awsfzoo.com/media/Corn-Snake-Website-906x580.jpg'),
        ('Max', '2019-04-10', 'Lizard', 'Leopard Gecko', 0.09, NULL),
        ('Albino', '2022-01-01', 'Snake', 'Albino Ball Python', 2.5, 'https://www.worldofballpythons.com/files/morphs/albino/014.jpg'),
        ('RedTail', '2021-05-15', 'Snake', 'Red Tail Boa', 3.8, 'https://www.thesprucepets.com/thmb/JvQXAZkK-f0DcspbhkbHhQKQfcM=/2099x0/filters:no_upscale():strip_icc()/GettyImages-10014219-56a2bd3b3df78cf772796415.jpg');
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
        INSERT INTO feedings (petId, feedingDate, preyType, preyWeight, notes, complete)
        VALUES
          (${pet.id}, '2025-01-01T08:00:00', 'Mouse', 1.5, 'First feeding of the year', FALSE),
          (${pet.id}, '2025-01-15T08:00:00', 'Rat', 2.0, 'Increased size for growth', FALSE);
      `);
    }
  }

  // Add logs for debugging purposes
  const allPets = await db.getAllAsync("SELECT * FROM pets");
  //console.log("All pets in the database:", allPets);

  const allFeedings = await db.getAllAsync("SELECT * FROM feedings");
  //console.log("All feedings in the database:", allFeedings);
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
    <SQLiteProvider databaseName="petTracker3.db" onInit={initializeDatabase}>
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
