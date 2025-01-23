import LogCard from "@/components/cards/log/LogCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

const Feedings = ({ petId, title }) => {
  const database = useSQLiteContext();
  const [feedings, setFeedings] = useState([]);

  useEffect(() => {
    const fetchFeedings = async () => {
      try {
        const records = await database.getAllAsync(
          `SELECT id, feedingDate, preyType, complete
           FROM feedings
           WHERE petId=${petId}
           ORDER BY feedingDate DESC`
        );
        setFeedings(records);
      } catch (err) {
        console.error("Error fetching feedings:", err);
      }
    };

    fetchFeedings();
  }, [database, petId]);

  return (
    <ThemedView>
      <ThemedText type="title">{title}</ThemedText>
      <ThemedView style={styles.container}>
        {feedings.map((feeding) => {
          const dateObj = new Date(feeding.feedingDate);
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          }).format(dateObj);

          const formattedTime = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }).format(dateObj);

          return (
            <LogCard
              key={feeding.id}
              feedingDate={formattedDate}
              feedingTime={formattedTime}
              preyType={feeding.preyType}
              initialComplete={feeding.complete}
              feedingId={feeding.id}
              petId={petId}
            />
          );
        })}
      </ThemedView>
    </ThemedView>
  );
};

export default Feedings;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
});
