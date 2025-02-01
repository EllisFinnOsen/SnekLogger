import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
// Import Portal from react-native-paper (or another portal library)
import { Portal } from "react-native-paper";

export default function AutocompleteInput({
  suggestions = [],
  value,
  onChangeText,
  placeholder,
  textColor,
  iconColor,
  bgColor,
  showAllOnFocus = true,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const filteredSuggestions =
    isFocused && value.trim() === "" && showAllOnFocus
      ? suggestions
      : suggestions.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        );

  const toggleDropdown = () => {
    setShowSuggestions((prev) => !prev);
    if (!showSuggestions) {
      setIsFocused(true);
    }
  };

  return (
    <View style={styles.autocompleteContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              borderColor: iconColor,
              backgroundColor: bgColor,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={iconColor}
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            if (value.trim() === "" && showAllOnFocus) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowSuggestions(false);
              setIsFocused(false);
            }, 200);
          }}
        />
        <TouchableOpacity
          style={styles.arrowContainer}
          onPress={toggleDropdown}
        >
          <Text style={{ color: iconColor, fontSize: 18 }}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Render the suggestions list inside a Portal */}
      <Portal>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <FlatList
            style={[
              styles.suggestionsContainer,
              { backgroundColor: bgColor, borderColor: iconColor },
            ]}
            data={filteredSuggestions}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  onChangeText(item);
                  setShowSuggestions(false);
                }}
              >
                <Text style={{ color: textColor }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    position: "relative",
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    padding: Platform.OS === "ios" ? 12 : 8,
  },
  arrowContainer: {
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionsContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 45,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    maxHeight: 150,
    zIndex: 9999,
    elevation: 20,
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
