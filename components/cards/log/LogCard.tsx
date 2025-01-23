import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SIZES } from "@/constants/Theme";
import Icon from "react-native-vector-icons/MaterialIcons"; // Example icon library
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";

const LogCard = ({
  feedingDate,
  feedingTime,
  preyType,
  initialComplete,
  feedingId,
  petId,
}) => {
  const [isChecked, setIsChecked] = useState(initialComplete);

  // Theme colors
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const subtleTextColor = useThemeColor({}, "subtleText");
  const activeColor = useThemeColor({}, "active");
  const bgColor = useThemeColor({}, "background");
  const database = useSQLiteContext();
  const router = useRouter();
  const handleToggleCheck = async () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);

    try {
      await database.execAsync(
        `UPDATE feedings SET complete = ${newCheckedState ? 1 : 0} WHERE id = ${feedingId}`
      );
    } catch (error) {
      console.error("Error updating feeding record:", error);
    }
  };
  // Formatting the date into mm/dd/yy
  const [year, month, day] = feedingDate.split("-");
  const dateObj = new Date(year, month - 1, day);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });

  // Formatting the time into h:mm am/pm
  const [hours, minutes] = feedingTime.split(":");
  const dateForTime = new Date();
  dateForTime.setHours(Number(hours), Number(minutes));
  const formattedTime = dateForTime.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  console.log("feedingDate:" + feedingDate);
  console.log("feedingTime:" + feedingTime);
  console.log("formattedDate:" + formattedDate);
  console.log("formattedTime:" + formattedTime);

  return (
    <>
      <ThemedView
        style={[
          styles.wrap,
          { backgroundColor: isChecked ? fieldColor : textColor },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.push(`/pets/${petId}/feedings/${feedingId}`)}
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
            <ThemedText
              type="subtitle"
              style={{
                color: isChecked ? textColor : bgColor,
              }}
            >
              {formattedDate}
            </ThemedText>
          </View>

          <View style={styles.details}>
            <ThemedText
              type="default"
              style={{
                color: isChecked ? textColor : bgColor,
              }}
            >
              {preyType}
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
});
