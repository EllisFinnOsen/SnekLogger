import React from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native";

import { ThemedText, type ThemedTextProps } from "@/components/ThemedText";

const GradientText: React.FC<ThemedTextProps> = (props) => {
  return (
    <MaskedView maskElement={<ThemedText {...props} />}>
      <LinearGradient
        colors={["lime", "green"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
