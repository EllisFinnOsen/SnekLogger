import { useState } from "react";
import { useGlobalSearchParams } from "expo-router";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateFeeding } from "@/store/feedingsSlice";
import { Stack } from "expo-router";
import ThemedScrollView from "@/components/ThemedScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useSQLiteContext } from "expo-sqlite";
import { useThemeColor } from "@/hooks/useThemeColor";
import DateTimePickerModal from '@react-native-community/datetimepicker';
import { IconSymbol } from "@/components/ui/IconSymbol";
import { SIZES } from "@/constants/Theme";

const FeedingDetails = () => {
  const params = useGlobalSearchParams();
  const { id, feedingId } = params;
  const dispatch = useDispatch();
  const db = useSQLiteContext();

  // Theme colors
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");
  const errorColor = useThemeColor({}, "error");

  const feeding = useSelector((state: RootState) => 
    state.feedings.list.find(f => f.id === Number(feedingId))
  );
  const status = useSelector((state: RootState) => state.feedings.status);
  const error = useSelector((state: RootState) => state.feedings.error);

  const [isEditing, setIsEditing] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [editedFeeding, setEditedFeeding] = useState(feeding ? {
    feedingDate: feeding.feedingDate,
    feedingTime: feeding.feedingTime,
    preyType: feeding.preyType,
    notes: feeding.notes || '',
    complete: feeding.complete,
  } : null);

  const handleSave = async () => {
    if (editedFeeding) {
      try {
        await dispatch(updateFeeding({
          db,
          feedingId: Number(feedingId),
          data: {
            ...editedFeeding,
            petId: Number(id)
          }
        })).unwrap();
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update feeding:", error);
      }
    }
  };

  const handleDateConfirm = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(editedFeeding.feedingDate);
    setDatePickerVisibility(false);
    
    const formattedDate = currentDate.toISOString().split('T')[0];
    setEditedFeeding(prev => ({
      ...prev,
      feedingDate: formattedDate
    }));
  };

  const handleTimeConfirm = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setTimePickerVisibility(false);
    
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    
    setEditedFeeding(prev => ({
      ...prev,
      feedingTime: formattedTime
    }));
  };

  if (status === "loading") {
    return <ActivityIndicator size="large" color={textColor} />;
  }

  if (!feeding || !editedFeeding) {
    return <ThemedText type="default">No feeding found</ThemedText>;
  }

  return (
    <>
      <Stack.Screen options={{ title: `Feeding Details` }} />
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
                    style={[styles.link, { color: errorColor }]}
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

        {/* Status Cell */}
        <View style={[styles.cell, { borderBottomColor: fieldColor }]}>
          <View style={styles.category}>
            <IconSymbol size={18} name="smallcircle.fill.circle" color={iconColor} />
            <ThemedText type="subtitle">Status: </ThemedText>
          </View>
          <TouchableOpacity 
            onPress={() => isEditing && setEditedFeeding(prev => ({
              ...prev,
              complete: !prev.complete
            }))}
          >
            <ThemedText type="default">
              {editedFeeding.complete ? "Complete" : "Not Completed"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Date Cell */}
        <View style={[styles.cell, { borderBottomColor: fieldColor }]}>
          <View style={styles.category}>
            <IconSymbol size={18} name="calendar.circle.fill" color={iconColor} />
            <ThemedText type="subtitle">Date:</ThemedText>
          </View>
          {isEditing ? (
            <TouchableOpacity
              style={styles.editableWrap}
              onPress={() => setDatePickerVisibility(true)}
            >
              <ThemedText
                style={[styles.editablefield, { backgroundColor: fieldColor }]}
                type="default"
              >
                {editedFeeding.feedingDate}
              </ThemedText>
              <IconSymbol size={18} name="edit" color={iconColor} />
            </TouchableOpacity>
          ) : (
            <ThemedText type="default">{editedFeeding.feedingDate}</ThemedText>
          )}
        </View>

        {/* Time Cell */}
        <View style={[styles.cell, { borderBottomColor: fieldColor }]}>
          <View style={styles.category}>
            <IconSymbol size={18} name="clock" color={iconColor} />
            <ThemedText type="subtitle">Time: </ThemedText>
          </View>
          {isEditing ? (
            <TouchableOpacity
              style={styles.editableWrap}
              onPress={() => setTimePickerVisibility(true)}
            >
              <ThemedText
                style={[styles.editablefield, { backgroundColor: fieldColor }]}
                type="default"
              >
                {editedFeeding.feedingTime}
              </ThemedText>
              <IconSymbol size={18} name="edit" color={iconColor} />
            </TouchableOpacity>
          ) : (
            <ThemedText type="default">{editedFeeding.feedingTime}</ThemedText>
          )}
        </View>

        {/* Prey Cell */}
        <View style={[styles.cell, { borderBottomColor: fieldColor }]}>
          <View style={styles.category}>
            <IconSymbol size={18} name="food" color={iconColor} />
            <ThemedText type="subtitle">Prey: </ThemedText>
          </View>
          {isEditing ? (
            <TextInput
              style={[styles.editablefield, { backgroundColor: fieldColor }]}
              value={editedFeeding.preyType}
              onChangeText={(text) => setEditedFeeding(prev => ({
                ...prev,
                preyType: text
              }))}
            />
          ) : (
            <ThemedText type="default">{editedFeeding.preyType}</ThemedText>
          )}
        </View>

        {/* Notes Section */}
        <View style={styles.notes}>
          <ThemedText type="title">Notes: </ThemedText>
          {isEditing ? (
            <TextInput
              style={[styles.textarea, { backgroundColor: fieldColor }]}
              value={editedFeeding.notes}
              onChangeText={(text) => setEditedFeeding(prev => ({
                ...prev,
                notes: text
              }))}
              multiline
            />
          ) : (
            <ThemedText type="default">{editedFeeding.notes}</ThemedText>
          )}
        </View>
      </ThemedScrollView>

      {Platform.OS === 'android' ? (
        <>
          {isDatePickerVisible && (
            <DateTimePickerModal
              value={new Date(editedFeeding.feedingDate)}
              mode="date"
              onChange={handleDateConfirm}
            />
          )}
          {isTimePickerVisible && (
            <DateTimePickerModal
              value={new Date(`2000-01-01T${editedFeeding.feedingTime}`)}
              mode="time"
              onChange={handleTimeConfirm}
            />
          )}
        </>
      ) : (
        <>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={() => setDatePickerVisibility(false)}
          />
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={() => setTimePickerVisibility(false)}
          />
        </>
      )}
    </>
  );
};

export default FeedingDetails;

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
    width: '100%',
  },
  notes: {
    flexDirection: "column",
    marginTop: 22,
    alignItems: "baseline",
    gap: 8,
  },
});
