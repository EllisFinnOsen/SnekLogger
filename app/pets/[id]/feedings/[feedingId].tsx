import { useGlobalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import useFetch from "@/hooks/useFetch";
import { Stack } from "expo-router";
import ThemedScrollView from "@/components/ThemedScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useSQLiteContext } from "expo-sqlite";

const FeedingDetails = () => {
  const db = useSQLiteContext();
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const params = useGlobalSearchParams();
  const { id } = params; // feedingId
  const { data, isLoading, error, refetch } = useFetch(
    `SELECT * FROM feedings WHERE id=${id}`
  );

  useEffect(() => {
    if (data && data.length > 0) {
      const feeding = data[0];
      const dateParts = feeding.feedingDate.split("-");
      const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0].slice(2)}`;
      const timeParts = feeding.feedingTime.split(":");
      const hours = parseInt(timeParts[0], 10);
      const formattedTime = `${hours > 12 ? hours - 12 : hours}:${timeParts[1]} ${hours >= 12 ? "pm" : "am"}`;

      // Initialize editedData only if it hasn’t been set
      if (!editedData) {
        setEditedData({
          feedingDate: formattedDate,
          feedingTime: formattedTime,
          preyType: feeding.preyType,
          notes: feeding.notes,
          complete: feeding.complete,
        });
      }
    }
  }, [data]);

  const handleSave = async () => {
    if (editedData) {
      try {
        // Convert the human-friendly edited date and time back into the database format
        console.log("Edited Data:", editedData);
        console.log("Feeding Date:", editedData?.feedingDate);
        console.log("Feeding Time:", editedData?.feedingTime);

        if (!editedData.feedingTime) {
          console.error("Feeding time is not defined.");
          return;
        }

        const [month, day, year] = editedData.feedingDate.split("/");
        const formattedDate = `20${year}-${month}-${day}`;
        const [time, amPm] = editedData.feedingTime.split(" ");
        const [hours, minutes] = time.split(":");
        const formattedTime = `${amPm.toLowerCase() === "pm" ? parseInt(hours, 10) + 12 : hours}:${minutes}:00`;

        await db.execAsync(`
          UPDATE feedings
          SET 
            feedingDate = '${formattedDate}',
            feedingTime = '${formattedTime}',
            preyType = '${editedData.preyType}',
            complete = ${editedData.complete ? 1 : 0},
            notes = '${editedData.notes}'
          WHERE id = ${id};
        `);
        setEditMode(false);
        refetch(); // Refresh the data after saving
      } catch (error) {
        console.error("Failed to update feeding record:", error);
      }
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (error || !data || data.length === 0) {
    return <Text>No feeding record found</Text>;
  }

  const feeding = data[0];
  // Display friendly formats for the user
  const dateParts = feeding.feedingDate.split("-");
  const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0].slice(2)}`;
  const timeParts = feeding.feedingTime.split(":");
  const hours = parseInt(timeParts[0], 10);
  const formattedTime = `${hours > 12 ? hours - 12 : hours}:${timeParts[1]} ${hours >= 12 ? "pm" : "am"}`;

  const handleChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `${formattedDate}`,
        }}
      />
      <ThemedScrollView>
        <View style={styles.row}>
          <ThemedText type="subtitle">Date: </ThemedText>
          {editMode ? (
            <TextInput
              style={styles.input}
              defaultValue={formattedDate}
              onChangeText={(value) => handleChange("feedingDate", value)}
            />
          ) : (
            <ThemedText type="default">{formattedDate}</ThemedText>
          )}
        </View>
        <View style={styles.row}>
          <ThemedText type="subtitle">Time: </ThemedText>
          {editMode ? (
            <TextInput
              style={styles.input}
              defaultValue={formattedTime}
              onChangeText={(value) => handleChange("feedingTime", value)}
            />
          ) : (
            <ThemedText type="default">{formattedTime}</ThemedText>
          )}
        </View>
        <View style={styles.row}>
          <ThemedText type="subtitle">Prey: </ThemedText>
          {editMode ? (
            <TextInput
              style={styles.input}
              defaultValue={feeding.preyType}
              onChangeText={(value) => handleChange("preyType", value)}
            />
          ) : (
            <ThemedText type="default">{feeding.preyType}</ThemedText>
          )}
        </View>
        <View style={styles.row}>
          <ThemedText type="subtitle">Complete: </ThemedText>
          {editMode ? (
            <TextInput
              style={styles.input}
              defaultValue={feeding.complete ? "Yes" : "No"}
              onChangeText={(value) =>
                handleChange("complete", value.toLowerCase() === "yes")
              }
            />
          ) : (
            <ThemedText type="default">
              {feeding.complete ? "Yes" : "No"}
            </ThemedText>
          )}
        </View>
        <View style={styles.notes}>
          <ThemedText type="title">Notes: </ThemedText>
          {editMode ? (
            <TextInput
              style={[styles.input, styles.textarea]}
              defaultValue={feeding.notes || ""}
              multiline
              onChangeText={(value) => handleChange("notes", value)}
            />
          ) : (
            <ThemedText type="default">{feeding.notes}</ThemedText>
          )}
        </View>
        {editMode ? (
          <View style={styles.editButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <ThemedText type="link">Save</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditMode(false)}
            >
              <ThemedText type="link">Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode(true)}
          >
            <ThemedText type="link">Edit</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  notes: {
    flexDirection: "column",
    marginTop: 22,
    alignItems: "baseline",
    gap: 8,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  textarea: {
    height: 80,
    textAlignVertical: "top",
  },
  editButton: {
    marginTop: 20,
    alignSelf: "flex-start",
  },
  editButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  saveButton: {
    alignSelf: "flex-start",
  },
  cancelButton: {
    alignSelf: "flex-start",
  },
});

export default FeedingDetails;
