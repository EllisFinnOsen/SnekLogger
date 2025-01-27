import { useState, useEffect } from "react";
import { useGlobalSearchParams, useRouter } from "expo-router"; // Add router import
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';  // Update import
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateFeeding, fetchAllFeedings } from "@/store/feedingsSlice";
import { fetchPets } from "@/store/petsSlice";
import { Stack } from "expo-router";
import ThemedScrollView from "@/components/ThemedScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useSQLiteContext } from "expo-sqlite";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { SIZES } from "@/constants/Theme";
import { DetailCell } from "@/components/details/DetailCell";
import { checkImageURL } from "@/utils";
import { PetSelectorDropdown } from "@/components/PetSelectorDropdown";
import {ToggleDetailCell} from "@/components/details/ToggleDetailCell";
import {DateTimeDetailCell} from "@/components/details/DateTimeDetailCell";
const FeedingDetails = () => {
  const params = useGlobalSearchParams();
  const { id, feedingId } = params;
  const router = useRouter(); // Initialize router
  const dispatch = useDispatch();
  const db = useSQLiteContext();

  // Theme colors
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");
  const subtleText = useThemeColor({}, "subtleText");

  const feeding = useSelector((state: RootState) => 
    state.feedings.list.find(f => f.id === Number(feedingId))
  );
  const status = useSelector((state: RootState) => state.feedings.status);
  const error = useSelector((state: RootState) => state.feedings.error);

  const [isEditing, setIsEditing] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);  // Add this state
  const [editedFeeding, setEditedFeeding] = useState(feeding ? {
    feedingDate: feeding.feedingDate,
    feedingTime: feeding.feedingTime,
    preyType: feeding.preyType,
    notes: feeding.notes || '',
    complete: feeding.complete,
    petId: feeding.petId, // Add petId to tracked state
  } : null);

  const pets = useSelector((state: RootState) => state.pets.list);
  const currentPet = useSelector((state: RootState) => 
    state.pets.list.find(p => p.id === Number(id))
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPetSelector, setShowPetSelector] = useState(false);

  const handleSave = async () => {
    if (editedFeeding) {
      try {
        console.log('FeedingDetails: Starting save with:', editedFeeding);
        
        const result = await dispatch(updateFeeding({
          db,
          feedingId: Number(feedingId),
          data: editedFeeding
        })).unwrap();
        
        console.log('FeedingDetails: Save completed, result:', result);
        setIsEditing(false);
  
        // Force refresh feedings list
        dispatch(fetchAllFeedings(db) as any);
        
      } catch (error) {
        console.error("FeedingDetails: Save failed:", error);
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

  const handleDatePress = () => {
    if (Platform.OS === 'android') {
      setShowDatePicker(true);
    } else {
      setDatePickerVisibility(true);
    }
  };

  const handleTimePress = () => {
    if (Platform.OS === 'android') {
      setShowTimePicker(true);
    } else {
      setTimePickerVisibility(true);
    }
  };

  const handlePetSelect = (newPetId: number) => {
    setEditedFeeding(prev => ({
      ...prev,
      petId: newPetId
    }));
    setShowPetSelector(false);
  };

  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchPets(db) as any);
      await dispatch(fetchAllFeedings(db) as any); // Add this line
    };
    loadData();
  }, []);

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

        <DetailCell
          icon="smallcircle.fill.circle"
          label="Pet"
          isPetImage
          customContent={
            <View style={styles.petSelector}>
              <Image
                source={{
                  uri: checkImageURL(pets.find(p => p.id === editedFeeding.petId)?.imageURL)
                    ? pets.find(p => p.id === editedFeeding.petId)?.imageURL
                    : "https://files.oaiusercontent.com/file-DjW5L9b81xAoE1CS5dgfGf?se=2025-01-22T19%3A04%3A19Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D4bc93413-3775-4d04-bb36-d00efe395407.webp&sig=4s4GNu/F9s40L9WCGzcndpvr4bnYlv6ftC7%2BPRitiO0%3D",
                }}
                style={styles.petImage}
              />
              <ThemedText type="default">
                {pets.find(p => p.id === editedFeeding.petId)?.name}
              </ThemedText>
            </View>
          }
          isEditing={isEditing}
          isDropdown
          onPress={() => setShowPetSelector(true)}
          dropdownComponent={
            <PetSelectorDropdown
              pets={pets}
              selectedPetId={editedFeeding.petId}
              feedingId={Number(feedingId)}
              feeding={feeding}
              onSelect={handlePetSelect}
              isVisible={showPetSelector}
              onClose={() => setShowPetSelector(false)}
            />
          }
          fieldColor={fieldColor}
          iconColor={iconColor}
        />

        <ToggleDetailCell
          icon="smallcircle.fill.circle"
          label="Status"
          value={editedFeeding.complete ? "Complete" : "Not Completed"}
          isEditing={isEditing}
          onToggle={() => setEditedFeeding(prev => ({
            ...prev,
            complete: !prev.complete
          }))}
          fieldColor={fieldColor}
          iconColor={iconColor}
        />

        <DateTimeDetailCell
          icon="calendar.circle.fill"
          label="Date"
          value={editedFeeding.feedingDate}
          isEditing={isEditing}
          onPress={handleDatePress}
          fieldColor={fieldColor}
          iconColor={iconColor}
        />

        <DateTimeDetailCell
          icon="clock"
          label="Time"
          value={editedFeeding.feedingTime}
          isEditing={isEditing}
          onPress={handleTimePress}
          fieldColor={fieldColor}
          iconColor={iconColor}
        />

<DetailCell
  icon="food"
  label="Prey"
  value={editedFeeding.preyType}
  isEditing={isEditing}
  isDropdown
  onValueChange={(value) => setEditedFeeding(prev => ({
    ...prev,
    preyType: value
  }))}
  fieldColor={fieldColor}
  iconColor={iconColor}
/>

        {/* Notes Section */}
        <View style={styles.notes}>
          <ThemedText type="title">Notes: </ThemedText>
          {isEditing ? (
            <TextInput
              style={[styles.textarea, { color: subtleText ,backgroundColor: fieldColor }]}
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
          {showDatePicker && (
            <DateTimePicker
              value={new Date(editedFeeding.feedingDate)}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date && event.type === 'set') {
                  handleDateConfirm(event, date);
                }
              }}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={new Date(`2000-01-01T${editedFeeding.feedingTime}`)}
              mode="time"
              display="default"
              onChange={(event, time) => {
                setShowTimePicker(false);
                if (time && event.type === 'set') {
                  handleTimeConfirm(event, time);
                }
              }}
            />
          )}
        </>
      ) : (
        <>
          <DateTimePicker
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={() => setDatePickerVisibility(false)}
          />
          <DateTimePicker
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
  petSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  petImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
