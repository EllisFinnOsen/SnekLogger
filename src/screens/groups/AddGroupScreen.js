import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { SIZES } from "@/constants/Theme";
import EditHeader from "@/components/global/EditHeader";
import { ThemedText } from "@/components/global/ThemedText";
import CustomButton from "@/components/global/CustomButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import NameField from "@/components/global/groups/NameField";
import NotesField from "@/components/global/pets/add_pet/NotesField";
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import { addGroup, fetchGroups } from "@/redux/actions";
import { addGroupToDb } from "@/database/groups";

export default function AddGroupScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const activeColor = useThemeColor({}, "active");

  // State for group details
  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch available groups if needed
  const availableGroups = useSelector((state) => state.groups.groups || []);
  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleCancel = () => {
    navigation.goBack(); // Discard changes and go back
  };

  const handleSave = async () => {
    // Validate group name
    if (!groupName.trim()) {
      setGroupNameError("Group name is required.");
      return;
    } else {
      setGroupNameError("");
    }

    const newGroup = {
      name: groupName,
      notes,
    };

    try {
      // Insert the new group into the database
      const groupId = await addGroupToDb(newGroup);
      if (!groupId) {
        // Handle error if needed.
        return;
      }
      // Update Redux state with the new group.
      dispatch(addGroup({ ...newGroup, id: groupId }));
      navigation.goBack();
    } catch (error) {
      //console.error("Error adding group:", error);
    }
  };

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <HeaderSection
        isEditing={true} // Always start in editing mode
        onSave={handleSave}
        onCancel={handleCancel}
      />
      <EditHeader
        label="Add New Group"
        description="Enter the group name and any notes, then press save to add a new group."
        onCancel={() => navigation.goBack()}
      />

      {/* Render the NameField for group name */}
      <NameField
        value={groupName}
        setValue={(text) => {
          setGroupName(text);
          if (text.trim()) {
            setGroupNameError("");
          }
        }}
        required={true}
        errorMessage={groupNameError}
        placeholder="Enter group name"
        label="Group Name"
        icon="at-outline"
      />

      {/* Notes Field */}
      <NotesField notes={notes} setNotes={setNotes} />

      <CustomButton
        title="Save"
        textType="title"
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: activeColor }]}
      />
      <View style={styles.spacer} />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 8,
  },
  fieldContainer: {
    marginVertical: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
    fontSize: SIZES.medium,
  },
  notesInputContainer: {
    // Optional styling wrapper for the notes field
  },
  saveButton: {
    marginTop: 16,
  },
  spacer: {
    height: 36,
  },
});
