import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SIZES } from "@/constants/Theme";
import Icon from "react-native-vector-icons/MaterialIcons"; // Example icon library
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { updateFeeding } from "@/store/feedingsSlice";
import { AppDispatch, RootState } from "@/store";
import { useSQLiteContext } from "expo-sqlite";

const LogCard = ({ feedingId, petId }) => {
  const feeding = useSelector((state: RootState) => {
    const found = state.feedings.list.find(f => f.id === feedingId);
    console.log('LogCard: Fetched feeding from Redux:', { feedingId, found });
    return found;
  });
  
  const pet = useSelector((state: RootState) => {
    const found = state.pets.list.find(p => p.id === petId);
    console.log('LogCard: Fetched pet from Redux:', { petId, found });
    return found;
  });
  const dispatch = useDispatch();
  const db = useSQLiteContext();
  const router = useRouter();

  if (!feeding) return null;

  const handleToggleCheck = () => {
    dispatch(updateFeeding({
      db,
      feedingId,
      data: {
        ...feeding,
        complete: !feeding.complete
      }
    }));
  };

  const handleNavigateToEdit = () => {
    console.log(`Navigating to feeding ${feedingId} for pet ${petId}`);
    router.push({
      pathname: `/pets/${petId}/feedings/${feedingId}`,
      params: { 
        id: petId.toString(),
        feedingId: feedingId.toString() 
      }
    });
  };

  // Use feeding data from Redux store instead of props
  const {
    feedingDate: date,
    feedingTime: time,
    preyType: prey,
    complete: isChecked
  } = feeding || {};

  // Theme colors
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const subtleTextColor = useThemeColor({}, "subtleText");
  const activeColor = useThemeColor({}, "active");
  const bgColor = useThemeColor({}, "background");

  // Formatting the date into mm/dd/yy
  const [year, month, day] = date.split("-");
  const dateObj = new Date(year, month - 1, day);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });

  // Formatting the time into h:mm am/pm
  const [hours, minutes] = time.split(":");
  const dateForTime = new Date();
  dateForTime.setHours(Number(hours), Number(minutes));
  const formattedTime = dateForTime.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <>
      <ThemedView
        style={[
          styles.wrap,
          { backgroundColor: isChecked ? fieldColor : textColor },
        ]}
      >
        <TouchableOpacity
          onPress={handleNavigateToEdit}
          style={[
            styles.container,
            { backgroundColor: isChecked ? fieldColor : textColor },
          ]}
        >
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleToggleCheck();
              }}
              style={styles.toggle}
            >
              <Icon
                name={isChecked ? "check-box" : "check-box-outline-blank"}
                size={24}
                color={isChecked ? activeColor : fieldColor}
              />
            </TouchableOpacity>
            <View style={styles.dateColumn}>
              <ThemedText
                type="smDetail"
                style={{
                  color: isChecked ? textColor : bgColor,
                }}
              >
                {pet?.name}
              </ThemedText>
              <ThemedText
                type="subtitle"
                style={{
                  color: isChecked ? textColor : bgColor,
                }}
              >
                {formattedDate}
              </ThemedText>
            </View>
          </View>

          <View style={styles.details}>
            <ThemedText
              type="default"
              style={{
                color: isChecked ? textColor : bgColor,
              }}
            >
              {prey}
            </ThemedText>

            <ThemedText
              type="default"
              style={{
                color: isChecked ? textColor : bgColor,
              }}
            >
              ({formattedTime})
            </ThemedText>
          </View>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
};

export default LogCard;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "stretch",
    borderRadius: SIZES.xSmall,
    width: "100%",
    alignItems: "flex-start",
    gap: 8,
    padding: 16,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: SIZES.xSmall,
    width: "100%",
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  details: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 0,
  },
  toggle: {
    flexDirection: "row",
    gap: 8,
  },
  dateColumn: {
    flexDirection: 'column',
    gap: 2,
  },
});
