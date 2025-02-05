// File: EditUserProfileScreen.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import EditHeader from "@/components/global/EditHeader";
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import CustomButton from "@/components/global/CustomButton";
import DatePickerField from "@/components/global/DatePickerField";
import { useThemeColor } from "@/hooks/useThemeColor";
import UserImageField from "@/components/UserImageField";
import UserNameField from "@/components/UserNameField";
import { updateUserProfile } from "@/redux/actions/userActions";
import {
  fetchUserProfileFromDb,
  updateUserProfileInDb,
} from "@/database/users";

export default function EditUserProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const fieldColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");

  // Get user profile from Redux
  const userProfileFromRedux = useSelector((state) => state.user.profile);

  // Local state for form inputs
  const [name, setName] = useState(userProfileFromRedux?.name || "");
  const [photo, setPhoto] = useState(userProfileFromRedux?.photo || "");
  const [birthdate, setBirthdate] = useState(
    userProfileFromRedux?.birthdate || ""
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Debug logs
  useEffect(() => {
    console.log("Initial Redux state:", userProfileFromRedux);
    console.log("Initial local state - Birthdate:", birthdate);
  }, []);

  // Load user profile from the database if Redux state is empty
  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        if (!userProfileFromRedux) {
          const userData = await fetchUserProfileFromDb();
          console.log("Fetched user profile from DB:", userData);
          if (userData) {
            setName(userData.name || "");
            setPhoto(userData.photo || "");
            setBirthdate(userData.birthdate || "");
            console.log("Setting birthdate from DB:", userData.birthdate);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  // Ensure Redux updates reflect in the state
  useEffect(() => {
    if (userProfileFromRedux) {
      console.log(
        "Updated Redux state - Birthdate:",
        userProfileFromRedux.birthdate
      );
      setName(userProfileFromRedux.name || "");
      setPhoto(userProfileFromRedux.photo || "");
      setBirthdate(userProfileFromRedux.birthdate || ""); // Ensure update
    }
  }, [userProfileFromRedux]);

  // Save updated user profile
  const handleSave = async () => {
    const updatedUser = { name, photo, birthdate };
    console.log("Saving profile with birthdate:", updatedUser);

    try {
      await updateUserProfileInDb(updatedUser);
      dispatch(updateUserProfile(updatedUser)); // Update Redux store
      console.log("Updated Redux state with:", updatedUser);
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return (
      <ThemedScrollView contentContainerStyle={styles.container}>
        <EditHeader label="Loading..." description="Fetching user data..." />
      </ThemedScrollView>
    );
  }

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <HeaderSection
        hasSave={true}
        onSave={handleSave}
        onCancel={() => navigation.goBack()}
        onBack={() => navigation.goBack()}
      />
      <EditHeader
        label="Edit Profile"
        description="Update your profile details below."
      />

      {/* Profile Image Field */}
      <UserImageField photo={photo} setPhoto={setPhoto} />

      {/* Name Field */}
      <UserNameField name={name} setName={setName} required={true} />

      {/* Birthdate Field */}
      <DatePickerField
        dateValue={birthdate} // ✅ Corrected to `dateValue`
        setDateValue={setBirthdate} // ✅ Ensure this updates `birthdate`
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        icon="calendar-clear"
      />

      {/* Save Button */}
      <CustomButton
        title="Save"
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: activeColor }]}
      />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  saveButton: { marginTop: 16 },
});
