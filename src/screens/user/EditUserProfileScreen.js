// File: EditUserProfileScreen.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { fetchUserProfileFromDb, updateUserProfileInDb } from "@/database";
import { updateUser, updateUserProfile } from "@/redux/actions";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import EditHeader from "@/components/global/EditHeader";
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import CustomButton from "@/components/global/CustomButton";
import DatePickerField from "@/components/global/DatePickerField";
import { useThemeColor } from "@/hooks/useThemeColor";
import UserImageField from "@/components/UserImageField";
import UserNameField from "@/components/UserNameField";

export default function EditUserProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const fieldColor = useThemeColor({}, "field");

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

  // Load user profile from the database if Redux state is empty
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await fetchUserProfileFromDb();
        if (userData) {
          setName(userData.name || "");
          setPhoto(userData.photo || "");
          setBirthdate(userData.birthdate || "");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!userProfileFromRedux) {
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [userProfileFromRedux]);

  // Save updated user profile
  const handleSave = async () => {
    const updatedUser = { name, photo, birthdate };

    try {
      await updateUserProfileInDb(updatedUser); // ✅ Update database
      dispatch(updateUserProfile(updatedUser)); // ✅ Update Redux store
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
      <UserImageField imageURL={photo} setImageURL={setPhoto} />

      {/* Name Field */}
      <UserNameField name={name} setName={setName} required={true} />

      {/* Birthdate Field */}
      <DatePickerField
        birthDate={birthdate}
        setBirthDate={setBirthdate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />

      {/* Save Button */}
      <CustomButton
        title="Save"
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: fieldColor }]}
      />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  saveButton: { marginTop: 16 },
});
