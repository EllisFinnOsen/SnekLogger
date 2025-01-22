import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";

const Log = ({ title }) => {
  return (
    <ThemedView>
      <ThemedText type="title">{title}</ThemedText>
    </ThemedView>
  );
};
export default Log;
