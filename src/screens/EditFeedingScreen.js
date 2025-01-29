import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Platform,
  Image,
} from "react-native";
import { DateTimePicker } from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedScrollView } from "@/components/global/ThemedScrollView";
import { ThemedText } from "@/components/global/ThemedText";
import { SIZES } from "@/constants/Theme";
import { checkImageURL } from "@/utils/checkImage";
import { updateFeeding, fetchPets } from "@/redux/actions";
import { fetchFeedingByIdFromDb, updateFeedingInDb } from "@/database";

export default function EditFeedingScreen({ route, navigation }) {
  const { feedingId } = route.params;
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets || []);
  const [feeding, setFeeding] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [feedingDate, setFeedingDate] = useState("");
  const [feedingTime, setFeedingTime] = useState("");
  const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit mode
  const [isComplete, setIsComplete] = useState(false); // State to manage the complete field
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Theme colors
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");
  const subtleText = useThemeColor({}, "subtleText");

  // Load the feeding details
  const loadFeeding = async () => {
    try {
      // Fetch the specific feeding by its ID
      const currentFeeding = await fetchFeedingByIdFromDb(feedingId);

      if (currentFeeding) {
        setFeeding(currentFeeding);
        setSelectedPetId(currentFeeding.petId);
        setFeedingDate(currentFeeding.feedingDate);
        setFeedingTime(currentFeeding.feedingTime);
        setIsComplete(currentFeeding.complete === 1); // Set the initial state of the complete field
      } else {
        console.error("Feeding not found for ID:", feedingId);
      }
    } catch (error) {
      console.error("Error loading feeding details:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFeeding();
      dispatch(fetchPets()); // Fetch pets for the picker
    }, [dispatch, feedingId])
  );

  const handleSave = async () => {
    try {
      await updateFeedingInDb(
        feedingId,
        selectedPetId,
        feedingDate,
        feedingTime,
        isComplete ? 1 : 0
      );
      dispatch(
        updateFeeding({
          id: feedingId,
          petId: selectedPetId,
          feedingDate,
          feedingTime,
          complete: isComplete ? 1 : 0,
        })
      );
      setFeeding({
        id: feedingId,
        petId: selectedPetId,
        feedingDate,
        feedingTime,
        complete: isComplete ? 1 : 0,
      }); // Update the feeding state with new values
      setIsEditing(false); // After saving, switch to view mode
    } catch (error) {
      console.error("Error updating feeding:", error);
    }
  };

  const handleCancel = () => {
    // Reset to the original feeding values (no changes)
    setSelectedPetId(feeding.petId);
    setFeedingDate(feeding.feedingDate);
    setFeedingTime(feeding.feedingTime);
    setIsComplete(feeding.complete === 1);
    setIsEditing(false); // Switch back to view mode
  };

  const handleDateConfirm = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(feedingDate);
    setShowDatePicker(false);

    const formattedDate = currentDate.toISOString().split("T")[0];
    setFeedingDate(formattedDate);
  };

  const handleTimeConfirm = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowTimePicker(false);

    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;

    setFeedingTime(formattedTime);
  };

  const handleDatePress = () => {
    if (Platform.OS === "android") {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const handleTimePress = () => {
    if (Platform.OS === "android") {
      setShowTimePicker(true);
    } else {
      setShowTimePicker(true);
    }
  };

  if (!feeding) return <ActivityIndicator size="large" color={textColor} />;

  // Convert to Date object for display formatting
  const feedingDateObj = new Date(feeding.feedingDate);
  const formattedDate = feedingDateObj.toISOString().split("T")[0];
  const formattedTime = feeding.feedingTime;

  return (
    <>
      <ThemedScrollView>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.heading}>
            Feeding Details
          </ThemedText>
          <View style={styles.links}>
            {isEditing ? (
              <>
                <TouchableOpacity onPress={() => setIsEditing(false)}>
                  <ThemedText
                    type="smDetail"
                    style={[styles.link, { color: subtleText }]}
                  >
                    Cancel
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave}>
                  <ThemedText
                    type="smDetail"
                    style={[styles.link, { color: activeColor }]}
                  >
                    Save
                  </ThemedText>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <ThemedText
                  type="smDetail"
                  style={[styles.link, { color: textColor }]}
                >
                  Edit
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.cell}>
          <View style={styles.category}>
            <Image
              source={{
                uri: checkImageURL(
                  pets.find((p) => p.id === selectedPetId)?.imageURL
                )
                  ? pets.find((p) => p.id === selectedPetId)?.imageURL
                  : "https://files.oaiusercontent.com/file-DjW5L9b81xAoE1CS5dgfGf?se=2025-01-22T19%3A04%3A19Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D4bc93413-3775-4d04-bb36-d00efe395407.webp&sig=4s4GNu/F9s40L9WCGzcndpvr4bnYlv6ftC7%2BPRitiO0%3D",
              }}
              style={styles.petImage}
            />
            <ThemedText type="default">
              {pets.find((p) => p.id === selectedPetId)?.name}
            </ThemedText>
          </View>
          {isEditing && (
            <Picker
              selectedValue={selectedPetId}
              onValueChange={(itemValue) => setSelectedPetId(itemValue)}
            >
              {pets.map((pet) => (
                <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
              ))}
            </Picker>
          )}
        </View>

        <View style={styles.cell}>
          <View style={styles.category}>
            <ThemedText type="default">Status</ThemedText>
          </View>
          {isEditing ? (
            <Switch
              value={isComplete}
              onValueChange={setIsComplete}
              disabled={!isEditing}
            />
          ) : (
            <ThemedText type="default">
              {isComplete ? "Complete" : "Not Completed"}
            </ThemedText>
          )}
        </View>

        <View style={styles.cell}>
          <View style={styles.category}>
            <ThemedText type="default">Date</ThemedText>
          </View>
          {isEditing ? (
            <TouchableOpacity onPress={handleDatePress}>
              <ThemedText type="default">{formattedDate}</ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedText type="default">{formattedDate}</ThemedText>
          )}
        </View>

        <View style={styles.cell}>
          <View style={styles.category}>
            <ThemedText type="default">Time</ThemedText>
          </View>
          {isEditing ? (
            <TouchableOpacity onPress={handleTimePress}>
              <ThemedText type="default">{formattedTime}</ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedText type="default">{formattedTime}</ThemedText>
          )}
        </View>

        <View style={styles.cell}>
          <View style={styles.category}>
            <ThemedText type="default">Prey</ThemedText>
          </View>
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                { color: subtleText, backgroundColor: fieldColor },
              ]}
              value={feeding.preyType}
              onChangeText={(text) =>
                setFeeding((prev) => ({ ...prev, preyType: text }))
              }
            />
          ) : (
            <ThemedText type="default">{feeding.preyType}</ThemedText>
          )}
        </View>

        <View style={styles.notes}>
          <ThemedText type="title">Notes: </ThemedText>
          {isEditing ? (
            <TextInput
              style={[
                styles.textarea,
                { color: subtleText, backgroundColor: fieldColor },
              ]}
              value={feeding.notes}
              onChangeText={(text) =>
                setFeeding((prev) => ({ ...prev, notes: text }))
              }
              multiline
            />
          ) : (
            <ThemedText type="default">{feeding.notes}</ThemedText>
          )}
        </View>
      </ThemedScrollView>

      {Platform.OS === "android" ? (
        <>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(feedingDate)}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date && event.type === "set") {
                  handleDateConfirm(event, date);
                }
              }}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={new Date(`2000-01-01T${feedingTime}`)}
              mode="time"
              display="default"
              onChange={(event, time) => {
                setShowTimePicker(false);
                if (time && event.type === "set") {
                  handleTimeConfirm(event, time);
                }
              }}
            />
          )}
        </>
      ) : (
        <>
          <DateTimePicker
            isVisible={showDatePicker}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={() => setShowDatePicker(false)}
          />
          <DateTimePicker
            isVisible={showTimePicker}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={() => setShowTimePicker(false)}
          />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
  heading: {
    fontSize: 24,
  },
  links: {
    flexDirection: "row",
    gap: 8,
  },
  link: {
    fontSize: 16,
    marginLeft: 8,
  },
  cell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
    padding: 8,
    gap: 8,
    borderBottomEndRadius: 6,
    borderBottomWidth: 1,
  },
  category: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  editablefield: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES.xSmall,
  },
  editableWrap: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 100,
    textAlignVertical: "top",
    width: "100%",
  },
  notes: {
    flexDirection: "column",
    marginTop: 22,
    alignItems: "baseline",
    gap: 8,
  },
  petImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
