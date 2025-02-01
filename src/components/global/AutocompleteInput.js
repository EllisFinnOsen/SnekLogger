import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { useDebounce } from "@/hooks/useDebounce";
import { useThemeColor } from "@/hooks/useThemeColor";
import Fuse from "fuse.js";

export default function AutocompleteInput({
  suggestions = [],
  value,
  onChangeText,
  placeholder,
  showAllOnFocus = true,
}) {
  // Get theme colors
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");
  const fieldColor = useThemeColor({}, "field");
  const fieldAccentColor = useThemeColor({}, "fieldAccent");

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const containerRef = useRef(null);

  const safeValue = value || "";
  const debouncedValue = useDebounce(safeValue, 300);

  const fuse = useMemo(() => {
    const options = {
      threshold: 0.4,
    };
    return new Fuse(suggestions, options);
  }, [suggestions]);

  // Measure the position of the input container relative to its parent
  const measurePosition = () => {
    if (containerRef.current) {
      containerRef.current.measure((x, y, width, height, pageX, pageY) => {
        // Set the dropdown to appear immediately below the input field.
        setDropdownTop(y + height - 40);
      });
    }
  };

  useEffect(() => {
    if (isFocused) {
      measurePosition();
    }
  }, [isFocused, safeValue]);

  const filteredSuggestions =
    isFocused && debouncedValue.trim() === "" && showAllOnFocus
      ? suggestions.slice(0, 50)
      : fuse
          .search(debouncedValue)
          .map((result) => result.item)
          .slice(0, 50);

  return (
    <View
      ref={containerRef}
      onLayout={measurePosition}
      style={styles.autocompleteContainer}
    >
      <View
        style={[
          styles.inputContainer,
          { borderColor: iconColor, backgroundColor: bgColor },
        ]}
      >
        <TextInput
          style={[styles.input, { color: textColor }]}
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
            setTimeout(() => {
              setShowSuggestions(false);
              setIsFocused(false);
            }, 200);
          }}
        />
        {/* The dropdown icon TouchableOpacity has been removed */}
      </View>
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
          keyboardShouldPersistTaps="always"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.suggestionItem,
                {
                  borderBottomColor: fieldAccentColor,
                  backgroundColor: fieldColor,
                },
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
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
  },
  input: {
    flex: 1,
  },
  // Removed arrowContainer style since it’s no longer needed
  suggestionsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    maxHeight: 150,
    zIndex: 9999,
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
  },
});
