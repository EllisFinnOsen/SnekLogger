import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateGroupToDb, deleteGroupFromDb } from "@/database"; // Make sure these are implemented in your database file.
import { updateGroup, deleteGroup, fetchGroups } from "@/redux/actions"; // Ensure these actions are defined.
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { SIZES } from "@/constants/Theme";
import EditHeader from "@/components/global/EditHeader";
import CustomButton from "@/components/global/CustomButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import NameField from "@/components/global/groups/NameField";
import NotesField from "@/components/global/pets/add_pet/NotesField";
import DeleteButton from "@/components/global/DeleteButton"; // Our reusable deletion component
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";

export default function EditGroupScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const activeColor = useThemeColor({}, "active");

  const { groupId } = route.params;

  // Get the group from Redux (assumes groups are stored in state.groups.groups)
  const group = useSelector((state) =>
    state.groups.groups.find((g) => g.id === groupId)
  );

  // Local state for group details
  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [notes, setNotes] = useState("");

  // Ensure groups are loaded (so that our group can be found)
  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  // Prepopulate the fields when the group is available
  useEffect(() => {
    if (group) {
      setGroupName(group.name || "");
      setNotes(group.notes || "");
    }
  }, [group]);

  const handleSave = async () => {
    if (!groupName.trim()) {
      setGroupNameError("Group name is required.");
      return;
    } else {
      setGroupNameError("");
    }

    const updatedGroup = {
      id: groupId,
      name: groupName,
      notes,
    };

    try {
      // Update the group in your database
      await updateGroupToDb(updatedGroup);
      // Dispatch Redux action to update the group in state
      dispatch(updateGroup(updatedGroup));
      navigation.goBack();
    } catch (error) {
      //console.error("Error updating group:", error);
    }
  };

  const handleDelete = async () => {
    try {
      // Delete the group from the database
      await deleteGroupFromDb(groupId);
      // Dispatch Redux action to remove the group from state
      dispatch(deleteGroup(groupId));
      // Navigate to a safe fallback screen (e.g., CollectionScreen)
      navigation.popToTop();
    } catch (error) {
      //console.error("Error deleting group:", error);
    }
  };

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <HeaderSection
        onSave={handleSave}
        hasSave={true}
        onCancel={() => navigation.goBack()}
        onBack={() => navigation.goBack()}
      />

      <EditHeader
        label="Edit Group"
        description="Update the group details below and press save."
        onCancel={() => navigation.goBack()}
      />

      {/* Name Field */}
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
      />

      {/* Notes Field */}
      <NotesField notes={notes} setNotes={setNotes} />

      <CustomButton
        title="Save"
        textType="title"
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: activeColor }]}
      />

      {/* Delete Group Button */}
      <DeleteButton
        onPress={handleDelete}
        title="Delete Group"
        confirmTitle="Confirm Delete"
        confirmMessage="Are you sure you want to delete this group?"
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
  saveButton: {
    marginTop: 16,
  },
  spacer: {
    height: 36,
  },
});
