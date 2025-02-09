import CustomButton from "@/components/global/CustomButton";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const SubscriptionScreen = ({ navigation }) => {
  const activeColor = useThemeColor({}, "active");
  const backgroundColor = useThemeColor({}, "background");
  const handleSubscription = () => {
    console.log("Redirecting to subscription payment...");
    // Here, implement Stripe, RevenueCat, or Expo In-App Purchases
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <ThemedText type="title">Trial Expired</ThemedText>
      <ThemedText style={styles.subtitle}>
        Your 30 day free trial has ended. Get the full app for just $5.99 now.
      </ThemedText>
      <CustomButton
        title="Get Full Version"
        onPress={handleSubscription}
        style={[styles.addButton, { backgroundColor: activeColor }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 64,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
});

export default SubscriptionScreen;
