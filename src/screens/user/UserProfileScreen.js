import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import EditHeader from "@/components/global/EditHeader";
import CustomButton from "@/components/global/CustomButton";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { checkImageURL } from "@/utils/checkImage";
import { Ionicons } from "@expo/vector-icons";
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import { fetchUserProfileFromDb } from "@/database/users";
import { updateUserProfile } from "@/redux/actions/userActions";

export default function UserProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const fieldColor = useThemeColor({}, "field");
  const iconColor = useThemeColor({}, "icon");

  // Get user profile from Redux
  const userProfileFromRedux = useSelector((state) => state.user.profile);

  // Local state for temporary updates before Redux syncs
  const [userProfile, setUserProfile] = useState(userProfileFromRedux);

  const loadUserProfile = async () => {
    try {
      console.log("Fetching user profile from database...");
      const userData = await fetchUserProfileFromDb();
      console.log("Database returned:", userData);
      if (userData) {
        setUserProfile(userData); // Update local state
        dispatch(updateUserProfile(userData)); // Update Redux
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserProfile(); // Always fetch the latest profile when screen is focused
    }, [])
  );

  // Ensure UI updates when Redux updates
  useEffect(() => {
    if (userProfileFromRedux) {
      setUserProfile(userProfileFromRedux);
    }
  }, [userProfileFromRedux]);

  if (!userProfile) {
    return (
      <ThemedScrollView contentContainerStyle={styles.container}>
        <ThemedText>Loading user profile...</ThemedText>
      </ThemedScrollView>
    );
  }

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <HeaderSection
        isEditing={false}
        onEdit={() => navigation.navigate("EditUserProfileScreen")}
        onCancel={() => {}}
        onBack={() => navigation.goBack()}
      />
      <EditHeader
        label="Profile"
        description="View your profile details below."
      />

      {/* Profile Image & Name */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: checkImageURL(userProfile.photo)
              ? userProfile.photo
              : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
          }}
          style={styles.profileImage}
        />
        <View style={styles.detailContainer}>
          <ThemedText type="title">{userProfile.name}</ThemedText>

          <View style={styles.birthdayContainer}>
            <Ionicons name="calendar-clear" size={18} color={iconColor} />
            <ThemedText
              type="default"
              style={[styles.label, { color: iconColor }]}
            >
              {userProfile.birthdate}
            </ThemedText>
          </View>
        </View>
      </View>
      <View style={[styles.spacer, { borderColor: fieldColor }]}></View>
      <EditHeader
        label="Settings"
        description="Make changes or manage your profile below."
      />
      <CustomButton
        title="Edit Profile"
        style={[styles.editButton, { backgroundColor: fieldColor }]}
        onPress={() => navigation.navigate("EditUserProfileScreen")}
      />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  detailContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginVertical: 20,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginRight: 12 },
  label: {
    marginLeft: 8,
  },
  editButton: { marginTop: 16 },
  birthdayContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  spacer: {
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 8,
  },
});
