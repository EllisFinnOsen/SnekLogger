// FeedingLogCard.js
import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "@/components/global/ThemedText";
import {
  toISODateTime,
  formatDateString,
  formatTimeString,
} from "@/utils/dateUtils";
import { SIZES } from "@/constants/Theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { updateFeedingInDb } from "@/database";
import { updateFeeding } from "@/redux/actions";
import { Ionicons } from "@expo/vector-icons";
import { startOfToday } from "date-fns";
import { checkImageURL } from "@/utils/checkImage";

export default function FeedingLogCard({
  item,
  animateOnChange = true,
  isVisible = true,
}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets || []);
  const pet = pets.find((pet) => pet.id === item.petId);
  const petName = pet ? pet.name : "Unknown Pet";
  const petImageURL =
    pet && checkImageURL(pet.imageURL)
      ? pet.imageURL
      : "https://files.oaiusercontent.com/file-DjW5L9b81xAoE1CS5dgfGf?se=2025-01-22T19%3A04%3A19Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D4bc93413-3775-4d04-bb36-d00efe395407.webp&sig=4s4GNu/F9s40L9WCGzcndpvr4bnYlv6ftC7%2BPRitiO0%3D";
  const dateObj = toISODateTime(item.feedingDate, item.feedingTime);

  const [isChecked, setIsChecked] = useState(item.complete === 1);

  const textColor = useThemeColor({}, "text");
  const fieldColor = useThemeColor({}, "field");
  const fieldAccent = useThemeColor({}, "fieldAccent");
  const activeColor = useThemeColor({}, "active");
  const iconColor = useThemeColor({}, "icon");
  const errorColor = useThemeColor({}, "error");
  const errorSubtle = useThemeColor({}, "errorSubtle");

  const today = startOfToday();
  const feedingDay = new Date(`${item.feedingDate}T00:00:00`);
  const isLate = !isChecked && feedingDay < today;

  const slideAnim = useRef(new Animated.Value(isVisible ? 0 : -20)).current;
  const fadeAnim = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

  useEffect(() => {
    setIsChecked(item.complete === 1);
  }, [item.complete]);

  useEffect(() => {
    if (!animateOnChange) return;

    if (isVisible) {
      slideAnim.setValue(20);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, animateOnChange, slideAnim, fadeAnim]);

  const handleToggleCheck = async () => {
    const newCompleteValue = isChecked ? 0 : 1;
    try {
      await updateFeedingInDb(
        item.id,
        item.petId,
        item.feedingDate,
        item.feedingTime,
        newCompleteValue
      );
      dispatch(updateFeeding({ ...item, complete: newCompleteValue }));
      setIsChecked(!isChecked);
    } catch (error) {}
  };

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          backgroundColor: isLate ? errorSubtle : fieldColor,
          borderColor: isLate
            ? errorColor
            : isChecked
              ? fieldAccent
              : iconColor,
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EditFeeding", { feedingId: item.id })
        }
        style={styles.container}
        testID="feeding-log-card"
      >
        {/* Top Row: Pet Image, Name, and Date */}
        <View style={styles.topRow}>
          <Image source={{ uri: petImageURL }} style={styles.petImage} />
          <View style={styles.nameDateColumn}>
            <ThemedText
              type="defaultSemiBold"
              style={{ color: isChecked ? iconColor : textColor }}
            >
              {petName}
              {item.isRecurring && (
                // Show a repeat icon if the feeding is part of a recurring schedule
                <Ionicons
                  name="repeat"
                  size={16}
                  color={iconColor}
                  style={{ marginLeft: 4 }}
                />
              )}
            </ThemedText>
            <ThemedText
              type="default"
              style={{ color: isChecked ? iconColor : textColor }}
            >
              {formatDateString(dateObj, "MM/DD/YY")}
            </ThemedText>
          </View>
        </View>

        {/* Bottom Row: Prey Type / Time and Checkbox Toggle */}
        <View style={styles.bottomRow}>
          <View style={styles.details}>
            <ThemedText
              type="default"
              style={{ color: isChecked ? iconColor : textColor }}
            >
              {item.preyType}
            </ThemedText>
            <ThemedText
              type="smDetail"
              style={{ color: isChecked ? iconColor : textColor }}
            >
              ({formatTimeString(dateObj)})
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              if (e && typeof e.stopPropagation === "function") {
                e.stopPropagation();
              }
              handleToggleCheck();
            }}
            style={styles.checkbox}
            testID="feeding-log-toggle"
          >
            <Ionicons
              name={isChecked ? "checkbox" : "square-outline"}
              size={24}
              color={isChecked ? activeColor : textColor}
              testID="feeding-log-icon"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: SIZES.xSmall,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: SIZES.xxSmall,
    borderWidth: 2,
    alignContent: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  nameDateColumn: {
    flexDirection: "column",
    marginLeft: 10,
  },
  petImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  details: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginRight: 16,
  },
  checkbox: {
    padding: 4,
  },
});
