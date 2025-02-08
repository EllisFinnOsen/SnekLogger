import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setFirstTimeUser } from "@/redux/actions/userActions";
import Onboarding from "react-native-onboarding-swiper";

const OnboardingScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const completeOnboarding = async () => {
    await AsyncStorage.setItem("firstTimeUser", "false");
    dispatch(setFirstTimeUser(false));
    navigation.replace("HomeScreen");
  };

  // Custom Next Button
  const NextButton = ({ ...props }) => (
    <TouchableOpacity {...props} style={{ padding: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Next</Text>
    </TouchableOpacity>
  );

  // Custom Done Button
  const DoneButton = ({ ...props }) => (
    <TouchableOpacity {...props} style={{ padding: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Done</Text>
    </TouchableOpacity>
  );

  return (
    <Onboarding
      onDone={completeOnboarding}
      onSkip={completeOnboarding}
      NextButtonComponent={NextButton}
      DoneButtonComponent={DoneButton}
      pages={[
        {
          backgroundColor: "#fff",
          image: <Text>👤</Text>,
          title: "Welcome to VorTrack",
          subtitle:
            "We make it easy to manage everything to do with your reptile's feedings",
        },
        {
          backgroundColor: "#fdeb93",
          image: <Text>🐶</Text>,
          title: "Add Your First Pet",
          subtitle: "Give your pet a name!",
        },
        {
          backgroundColor: "#ffccbc",
          image: <Text>✅</Text>,
          title: "You're All Set!",
          subtitle: "Let's get started.",
        },
      ]}
    />
  );
};

export default OnboardingScreen;
