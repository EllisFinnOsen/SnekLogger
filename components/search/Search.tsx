import { useState } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "./search.style";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

const Search = ({ searchTerm, setSearchTerm, handleClick }) => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const subtleText = useThemeColor({}, "subtleText");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");

  return (
    <ThemedView>
      <ThemedView style={styles.searchContainer}>
        <ThemedView
          style={[styles.searchWrapper, { backgroundColor: fieldColor }]}
        >
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            placeholder="What are you looking for?"
            placeholderTextColor={subtleText}
          />
        </ThemedView>

        <TouchableOpacity style={styles.searchBtn} onPress={handleClick}>
          <IconSymbol
            size={28}
            name="magnifyingglass.circle"
            color={iconColor}
          />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

export default Search;
