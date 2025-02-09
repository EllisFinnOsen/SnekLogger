import React from "react";
import { View, Switch, StyleSheet } from "react-native";
import SimplePicker from "../SimplePicker";
import DateTimeFields from "./DateTimeFields";
import QuantityField from "@/components/QuantityField";
import { ThemedText } from "@/components/global/ThemedText";

export default function RecurringFields({
  isRecurring = false,
  setIsRecurring = () => {},
  frequency = "Daily",
  setFrequency = () => {},
  interval = 1,
  setInterval = () => {},
  customUnit = "Day",
  setCustomUnit = () => {},
  endType = "Never",
  setEndType = () => {},
  endDate = new Date(),
  setEndDate = () => {},
  occurrenceCount = 1,
  setOccurrenceCount = () => {},
}) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ThemedText type="default">Recurring Feeding?</ThemedText>
        <Switch value={isRecurring} onValueChange={setIsRecurring} />
      </View>

      {isRecurring && (
        <>
          <SimplePicker
            label="Frequency"
            options={["Daily", "Weekly", "Monthly", "Yearly", "Custom"]}
            selectedValue={frequency}
            onValueChange={setFrequency}
          />

          {frequency === "Custom" && (
            <SimplePicker
              label="Custom Unit"
              options={["Day", "Week", "Month"]}
              selectedValue={customUnit}
              onValueChange={setCustomUnit}
            />
          )}

          <SimplePicker
            label="End Condition"
            options={["Never", "On a specific date", "After X occurrences"]}
            selectedValue={endType}
            onValueChange={setEndType}
          />

          {endType === "On a specific date" && (
            <DateTimeFields feedingDate={endDate} setFeedingDate={setEndDate} />
          )}

          {endType === "After X occurrences" && (
            <QuantityField
              quantity={occurrenceCount}
              setQuantity={setOccurrenceCount}
              isEditing={true}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
});
