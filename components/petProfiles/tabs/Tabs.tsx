import React from "react";
import {
  TouchableOpacity,
  FlatList,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { SIZES, FONT } from "@/constants/Theme";
import { useThemeColor } from "@/hooks/useThemeColor";

// Dynamic style functions
const buttonStyle = (
  name: string,
  activeTab: string,
  activeColor: string,
  subtleTextColor: string,
  iconColor: string
) => ({
  paddingVertical: SIZES.medium,
  paddingHorizontal: SIZES.xLarge,
  backgroundColor: name === activeTab ? activeColor : subtleTextColor,
  borderRadius: SIZES.xSmall,
  marginLeft: 2,
  shadowColor: iconColor,
});

const buttonTextStyle = (
  name: string,
  activeTab: string,
  textColor: string,
  bgColor: string
) => ({
  fontFamily: FONT.medium,
  fontSize: SIZES.small,
  color: name === activeTab ? textColor : bgColor,
});

function TabButton({
  name,
  activeTab,
  onHandleSearchType,
  activeColor,
  subtleTextColor,
  iconColor,
  textColor,
  bgColor,
}) {
  return (
    <TouchableOpacity
      style={buttonStyle(
        name,
        activeTab,
        activeColor,
        subtleTextColor,
        iconColor
      )}
      onPress={onHandleSearchType}
    >
      <Text style={buttonTextStyle(name, activeTab, textColor, bgColor)}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const subtleTextColor = useThemeColor({}, "subtleText");
  const activeColor = useThemeColor({}, "active");
  const bgColor = useThemeColor({}, "background");

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={tabs}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TabButton
            name={item}
            activeTab={activeTab}
            onHandleSearchType={() => setActiveTab(item)}
            activeColor={activeColor}
            subtleTextColor={subtleTextColor}
            iconColor={iconColor}
            textColor={textColor}
          />
        )}
        contentContainerStyle={{ columnGap: SIZES.small / 2 }}
        keyExtractor={(item) => item}
      />
    </ThemedView>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.small,
    marginBottom: SIZES.small / 2,
  },
});
