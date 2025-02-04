// RecurringScheduleForm.js
import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { ThemedText } from "@/components/global/ThemedText";
import { Picker } from "@react-native-picker/picker"; // or your preferred picker component
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "@/components/global/CustomButton";

export default function RecurringScheduleForm({ schedule, onChange }) {
  // schedule is an object containing:
  // { isRecurring, frequency, interval, customUnit, endType, endDate, occurrenceCount }
  // onChange should be called with the updated schedule object

  // Use local state for any fields if needed:
  const [isRecurring, setIsRecurring] = useState(
    schedule?.isRecurring || false
  );
  const [frequency, setFrequency] = useState(schedule?.frequency || "none");
  const [interval, setInterval] = useState(schedule?.interval || 1);
  const [customUnit, setCustomUnit] = useState(schedule?.customUnit || "week");
  const [endType, setEndType] = useState(schedule?.endType || "never");
  const [endDate, setEndDate] = useState(schedule?.endDate || new Date());
  const [occurrenceCount, setOccurrenceCount] = useState(
    schedule?.occurrenceCount || 0
  );
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // When any field changes, bubble up the new schedule object.
  const handleChange = (changes) => {
    const newSchedule = {
      isRecurring,
      frequency,
      interval,
      customUnit,
      endType,
      endDate,
      occurrenceCount,
      ...changes,
    };
    onChange(newSchedule);
  };

  return (
    <View style={styles.container}>
      {/* Toggle Recurring */}
      <ThemedText type="subtitle">Recurring Feeding</ThemedText>
      <Picker
        selectedValue={isRecurring ? "yes" : "no"}
        style={styles.picker}
        onValueChange={(value) => {
          const newRecurring = value === "yes";
          setIsRecurring(newRecurring);
          handleChange({ isRecurring: newRecurring });
        }}
      >
        <Picker.Item label="One-off" value="no" />
        <Picker.Item label="Recurring" value="yes" />
      </Picker>

      {isRecurring && (
        <View style={styles.recurringContainer}>
          {/* Frequency Picker */}
          <ThemedText type="default">Repeat Frequency</ThemedText>
          <Picker
            selectedValue={frequency}
            style={styles.picker}
            onValueChange={(value) => {
              setFrequency(value);
              handleChange({ frequency: value });
            }}
          >
            <Picker.Item label="Every Day" value="daily" />
            <Picker.Item label="Every Week" value="weekly" />
            <Picker.Item label="Every Month" value="monthly" />
            <Picker.Item label="Every Year" value="yearly" />
            <Picker.Item label="Custom" value="custom" />
          </Picker>

          {/* If custom frequency, allow interval and unit */}
          {frequency === "custom" && (
            <View style={styles.customRow}>
              <ThemedText type="default">Repeat every</ThemedText>
              <Picker
                selectedValue={interval.toString()}
                style={styles.smallPicker}
                onValueChange={(value) => {
                  const num = Number(value);
                  setInterval(num);
                  handleChange({ interval: num });
                }}
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <Picker.Item
                    key={i + 1}
                    label={`${i + 1}`}
                    value={(i + 1).toString()}
                  />
                ))}
              </Picker>
              <Picker
                selectedValue={customUnit}
                style={styles.smallPicker}
                onValueChange={(value) => {
                  setCustomUnit(value);
                  handleChange({ customUnit: value });
                }}
              >
                <Picker.Item label="Day(s)" value="day" />
                <Picker.Item label="Week(s)" value="week" />
                <Picker.Item label="Month(s)" value="month" />
                <Picker.Item label="Year(s)" value="year" />
              </Picker>
            </View>
          )}

          {/* End Options */}
          <ThemedText type="default">Ends</ThemedText>
          <Picker
            selectedValue={endType}
            style={styles.picker}
            onValueChange={(value) => {
              setEndType(value);
              handleChange({ endType: value });
            }}
          >
            <Picker.Item label="Never" value="never" />
            <Picker.Item label="On Date" value="on" />
            <Picker.Item label="After N Occurrences" value="after" />
          </Picker>

          {endType === "on" && (
            <View>
              <CustomButton
                title={`Pick End Date (${endDate.toISOString().split("T")[0]})`}
                onPress={() => setShowEndDatePicker(true)}
              />
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowEndDatePicker(false);
                    if (selectedDate) {
                      setEndDate(selectedDate);
                      handleChange({ endDate: selectedDate });
                    }
                  }}
                />
              )}
            </View>
          )}
          {endType === "after" && (
            <View style={styles.customRow}>
              <ThemedText type="default">After</ThemedText>
              <Picker
                selectedValue={occurrenceCount.toString()}
                style={styles.smallPicker}
                onValueChange={(value) => {
                  const count = Number(value);
                  setOccurrenceCount(count);
                  handleChange({ occurrenceCount: count });
                }}
              >
                {Array.from({ length: 20 }, (_, i) => (
                  <Picker.Item
                    key={i + 1}
                    label={`${i + 1}`}
                    value={(i + 1).toString()}
                  />
                ))}
              </Picker>
              <ThemedText type="default">occurrences</ThemedText>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  recurringContainer: {
    marginTop: 8,
  },
  picker: {
    width: "100%",
  },
  smallPicker: {
    width: 80,
    marginHorizontal: 8,
  },
  customRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});
