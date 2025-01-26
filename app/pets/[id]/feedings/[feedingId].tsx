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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateFeeding } from "@/store/feedingsSlice";
import { Stack } from "expo-router";
import ThemedScrollView from "@/components/ThemedScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useSQLiteContext } from "expo-sqlite";

const FeedingDetails = () => {
  const dispatch = useDispatch();
  const db = useSQLiteContext();
  const [editMode, setEditMode] = useState(false);
  const params = useGlobalSearchParams();
  const { id } = params;

  // Get feeding from Redux store instead of useFetch
  const feeding = useSelector((state: RootState) => 
    state.feedings.list.find(f => f.id === Number(id))
  );
  const status = useSelector((state: RootState) => state.feedings.status);

  const [editedData, setEditedData] = useState(feeding ? {
    feedingDate: formatDate(feeding.feedingDate),
    feedingTime: formatTime(feeding.feedingTime),
    preyType: feeding.preyType,
    notes: feeding.notes,
    complete: feeding.complete,
  } : null);

  const handleSave = async () => {
    if (editedData) {
      try {
        const [month, day, year] = editedData.feedingDate.split("/");
        const formattedDate = `20${year}-${month}-${day}`;
        const [time, amPm] = editedData.feedingTime.split(" ");
        let [hours, minutes] = time.split(":");
        hours = amPm.toLowerCase() === "pm" ? 
          (parseInt(hours, 10) % 12 + 12).toString() : 
          (parseInt(hours, 10) % 12).toString().padStart(2, '0');

        await dispatch(updateFeeding({
          db,
          feedingId: Number(id),
          data: {
            ...editedData,
            feedingDate: formattedDate,
            feedingTime: `${hours}:${minutes}:00`
          }
        })).unwrap();

        setEditMode(false);
      } catch (error) {
        console.error("Failed to update feeding:", error);
      }
    }
  };

  if (status === "loading") {
    return <ActivityIndicator size="large" />;
  }

  if (!feeding) {
    return <Text>No feeding record found</Text>;
  }

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
          title: `${formatDate(feeding.feedingDate)}`,
        }}
      />
      <ThemedScrollView>
        <View style={styles.row}>
          <ThemedText type="subtitle">Date: </ThemedText>
          {editMode ? (
            <TextInput
              style={styles.input}
              defaultValue={formatDate(feeding.feedingDate)}
              onChangeText={(value) => handleChange("feedingDate", value)}
            />
          ) : (
            <ThemedText type="default">{formatDate(feeding.feedingDate)}</ThemedText>
          )}
        </View>
        <View style={styles.row}>
          <ThemedText type="subtitle">Time: </ThemedText>
          {editMode ? (
            <TextInput
              style={styles.input}
              defaultValue={formatTime(feeding.feedingTime)}
              onChangeText={(value) => handleChange("feedingTime", value)}
            />
          ) : (
            <ThemedText type="default">{formatTime(feeding.feedingTime)}</ThemedText>
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

// Helper functions
const formatDate = (dateStr: string) => {
  const dateParts = dateStr.split("-");
  return `${dateParts[1]}/${dateParts[2]}/${dateParts[0].slice(2)}`;
};

const formatTime = (timeStr: string) => {
  const timeParts = timeStr.split(":");
  const hours = parseInt(timeParts[0], 10);
  return `${hours > 12 ? hours - 12 : hours}:${timeParts[1]} ${
    hours >= 12 ? "pm" : "am"
  }`;
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
