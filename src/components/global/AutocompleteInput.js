// AutocompleteInput.js
import { useDebounce } from "@/hooks/useDebounce";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
// Import Portal from react-native-paper
import { Portal } from "react-native-paper";
import { ThemedText } from "./ThemedText";
import Fuse from "fuse.js";

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

  // Debounce the input value
  const debouncedValue = useDebounce(safeValue, 300);

  // Create a Fuse instance with your suggestions. We use useMemo so it only recomputes
  // if the suggestions array changes.
  const fuse = useMemo(() => {
    const options = {
      threshold: 0.4, // Adjust this value (0.0 = exact match, 1.0 = very fuzzy)
      // Optionally, if your suggestion items are objects, you can define keys here.
      // For a simple array of strings, Fuse.js works out of the box.
    };
    return new Fuse(suggestions, options);
  }, [suggestions]);

  // Measure the position of the autocomplete container on layout
  const measurePosition = () => {
    if (containerRef.current) {
      containerRef.current.measureInWindow((x, y, width, height) => {
        // Position dropdown just below the container with an added offset (adjust offset as needed)
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
  // If input is empty and we're showing all on focus, limit to 50.
  // Otherwise, use Fuse.js to search and return the best 50 matches.
  const filteredSuggestions =
    isFocused && debouncedValue.trim() === "" && showAllOnFocus
      ? suggestions.slice(0, 50)
      : fuse
          .search(debouncedValue)
          .map((result) => result.item)
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
          <ThemedText type="default" style={{ color: iconColor, fontSize: 18 }}>
            ▼
          </ThemedText>
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
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="always"
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
    zIndex: 9999,
    elevation: 20,
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
  },
});
