import { StyleSheet } from "react-native";

import { Colors, SIZES } from "@/src/constants/Theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "col",
    padding: SIZES.medium,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: "70%",
    height: "70%",
  },
  textContainer: {
    flex: 1,
    marginHorizontal: SIZES.medium,
  },
  petName: {
    fontSize: SIZES.medium,
  },
  petType: {
    fontSize: SIZES.small + 2,
    marginTop: 3,
    textTransform: "capitalize",
  },
});

export default styles;
