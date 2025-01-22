import React, { useState } from "react";
import { TouchableOpacity, FlatList, Text, View } from "react-native";

import { SIZES, FONT, Colors } from "@/constants/Theme";

function TabButton({ name, activeTab, onHandleSearchType }) {
  return (
    <TouchableOpacity onPress={onHandleSearchType}>
      <Text>{name}</Text>
    </TouchableOpacity>
  );
}

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={tabs}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TabButton
            name={item}
            activeTab={activeTab}
            onHandleSearchType={() => setActiveTab(item)}
          />
        )}
        contentContainerStyle={{ columnGap: SIZES.small / 2 }}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

export default Tabs;

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.small,
    marginBottom: SIZES.small / 2,
  },
});
