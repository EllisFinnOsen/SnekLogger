// UserImageField.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "./global/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FONT, SIZES } from "@/constants/Theme";

export default function UserImageField({ photo, setPhoto }) {
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const errorColor = useThemeColor({}, "error");
  const activeColor = useThemeColor({}, "active");
  const textColor = useThemeColor({}, "text");
  // Function that shows an alert with two options: Gallery or Camera.
  const handlePickImage = () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        { text: "Choose from Gallery", onPress: pickFromGallery },
        { text: "Take Photo", onPress: takePhoto },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  // Function to pick image from gallery
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Gallery access is needed.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhoto(result.assets[0].uri); // ✅ Corrected
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera access is needed.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhoto(result.assets[0].uri); // ✅ Corrected
    }
  };

  // Function to delete the currently selected image
  const handleDeleteImage = () => {
    setPhoto("");
  };

  return (
    <View style={styles.container}>
      <ThemedText type="default" style={styles.title}>
        Profile Image
      </ThemedText>
      <View style={styles.imageRow}>
        {/* Circle placeholder */}
        <TouchableOpacity
          style={[
            styles.imagePlaceholder,
            { borderColor: iconColor, backgroundColor: fieldColor },
          ]}
          onPress={handlePickImage}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.image} />
          ) : (
            <Ionicons
              name="cloud-upload"
              size={24}
              color={iconColor}
              testID="add-image-icon"
            />
          )}
        </TouchableOpacity>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: activeColor }]}
            onPress={handlePickImage}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  fontFamily: FONT.regular,
                  fontSize: SIZES.medium,
                  color: textColor,
                },
              ]}
            >
              {photo ? "Change Photo" : "Upload Photo"}
            </Text>
          </TouchableOpacity>
          {photo ? (
            <TouchableOpacity
              style={[
                styles.button,
                styles.deleteButton,
                { backgroundColor: fieldColor },
              ]}
              onPress={handleDeleteImage}
            >
              <ThemedText
                type="default"
                style={[
                  styles.buttonText,
                  styles.deleteButtonText,
                  { color: errorColor },
                ]}
              >
                Delete Image
              </ThemedText>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    marginBottom: 4,
    fontSize: 16,
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: SIZES.small,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 16,
  },
  uploadIcon: {
    fontSize: 32,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonsContainer: {
    flex: 1,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  buttonText: {
    textAlign: "center",
  },
  deleteButton: {},
  deleteButtonText: {},
});
