import { Image, StyleSheet, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";

import { HelloWave } from "@/components/HelloWave";
import ThemedScrollView from "@/components/ThemedScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Search from "@/components/search/Search";
import Pets from "@/components/pets/Pets";
import Upcoming from "@/components/upcoming/Upcoming";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import DirectDbCheck from "@/components/DirectDbCheck";

async function listTables(db) {
  try {
    const tables = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    console.log("Tables in database:", tables);
  } catch (error) {
    console.error("Error listing tables:", error);
  }
}

async function checkSQLiteVersion(db) {
  try {
    const result = await db.getFirstAsync(
      "SELECT sqlite_version() AS sqlite_version"
    );
    console.log("SQLite version:", result.sqlite_version);
  } catch (error) {
    console.error("Error checking SQLite version:", error);
  }
}

export default function HomeScreen() {
  const db = useSQLiteContext();
  console.log("DB" + db);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function verifyDatabase() {
      if (!db) return;
      await listTables(db);
      await checkSQLiteVersion(db);
    }

    verifyDatabase();
  }, [db]);

  return (
    <ThemedScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hello, Ellis</ThemedText>
        <HelloWave />
      </ThemedView>
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleClick={() => {
          if (searchTerm) {
            router.push(`/explore`);
          }
        }}
      />
      <DirectDbCheck />
      <ThemedView style={styles.stepContainer}></ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Something Else</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gradient: {
    // Match the size of the text
    padding: 10,
    borderRadius: 5,
  },
  stepContainer: {
    gap: 18,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "transparent", // Makes the gradient visible
    backgroundColor: "transparent", // Ensures no background color interferes
  },
});
