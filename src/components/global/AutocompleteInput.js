// AutocompleteInput.js
import { useDebounce } from "@/hooks/useDebounce";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
// Import Portal from react-native-paper
import { Portal } from "react-native-paper";
import { ThemedText } from "./ThemedText";

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
  const [dropdownTop, setDropdownTop] = useState(0);
  const containerRef = useRef(null);
  const fieldColor = useThemeColor({}, "field");

  // Ensure value is a string (if it's null, default to "")
  const safeValue = value || "";

  // Measure the position of the autocomplete container on layout
  const measurePosition = () => {
    if (containerRef.current) {
      containerRef.current.measureInWindow((x, y, width, height) => {
        // Position dropdown just below the container with an added offset of 5px
        setDropdownTop(y + height + 50);
      });
    }
  };

  // Re-measure whenever the input is focused or safeValue changes
  useEffect(() => {
    if (isFocused) {
      measurePosition();
    }
  }, [isFocused, safeValue]);

  // Determine which suggestions to show:
  const debouncedValue = useDebounce(safeValue, 300);
  const filteredSuggestions =
    isFocused && debouncedValue.trim() === "" && showAllOnFocus
      ? suggestions.slice(0, 50)
      : suggestions
          .filter(
            (item) =>
              item && item.toLowerCase().includes(debouncedValue.toLowerCase())
          )
          .slice(0, 50);

  const toggleDropdown = () => {
    setShowSuggestions((prev) => !prev);
    if (!showSuggestions) {
      setIsFocused(true);
      measurePosition();
    }
  };

  return (
    <View
      ref={containerRef}
      onLayout={measurePosition}
      style={styles.autocompleteContainer}
    >
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
          value={safeValue}
          onChangeText={(text) => {
            onChangeText(text);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            // Show suggestions immediately on focus if nothing has been typed yet
            if (safeValue.trim() === "" && showAllOnFocus) {
              setShowSuggestions(true);
            }
            measurePosition();
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow press events on suggestion items
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
              {
                backgroundColor: bgColor,
                borderColor: iconColor,
                top: dropdownTop,
              },
            ]}
            data={filteredSuggestions}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.suggestionItem,
                  { borderBottomColor: fieldColor },
                ]}
                onPress={() => {
                  onChangeText(item);
                  setShowSuggestions(false);
                }}
              >
                <ThemedText type="default" style={{ color: textColor }}>
                  {item}
                </ThemedText>
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
    left: 0,
    right: 0,
    borderWidth: 1,
    marginHorizontal: 16,
    borderTopWidth: 0,
    maxHeight: 150,
    zIndex: 9999, // high z-index for proper stacking
    elevation: 20, // ensures the dropdown appears above other elements on Android
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
  },
});
