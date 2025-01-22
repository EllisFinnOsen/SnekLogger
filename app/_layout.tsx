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
// Function to initialize the database
async function initializeDatabase(db: SQLiteDatabase) {
  // Ensure the pets table exists
  console.log("Ensuring table exists...");
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
  console.log("Table creation check completed.");

  // Fetch the table info to check existing columns
  const columns: Array<{ name: string }> = await db.getAllAsync(
    `PRAGMA table_info(pets);`
  );

  const columnNames = columns.map((col) => col.name);

  // Add missing columns
  if (!columnNames.includes("species")) {
    await db.execAsync(`ALTER TABLE pets ADD COLUMN species TEXT;`);
  }

  if (!columnNames.includes("morph")) {
    await db.execAsync(`ALTER TABLE pets ADD COLUMN morph TEXT;`);
  }

  if (!columnNames.includes("birthDate")) {
    await db.execAsync(`ALTER TABLE pets ADD COLUMN birthDate TEXT;`);
  }

  if (!columnNames.includes("weight")) {
    await db.execAsync(`ALTER TABLE pets ADD COLUMN weight REAL;`);
  }

  if (!columnNames.includes("imageURL")) {
    await db.execAsync(`ALTER TABLE pets ADD COLUMN imageURL TEXT;`);
  }

  // Insert sample data
  const existingPets: Array<{
    name: string;
    birthDate: string;
    species: string;
    morph: string;
    weight: number;
    imageURL: string;
  }> = await db.getAllAsync("SELECT * FROM pets");

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

  // Retrieve and log all data from the pets table
  const allPets = await db.getAllAsync("SELECT * FROM pets");
  //console.log("All pets in the database:", allPets);
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
