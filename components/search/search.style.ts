import { StyleSheet } from "react-native";

import { Colors, FONT, SIZES } from "@/src/constants/Theme";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  userName: {
    fontFamily: FONT.regular,
    fontSize: SIZES.large,
  },
  welcomeMessage: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    marginTop: 2,
  },
  searchContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    marginTop: SIZES.small,
    marginBottom: SIZES.medium,
    height: 50,
  },
  searchWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.medium,
    height: "100%",
  },
  searchInput: {
    fontFamily: FONT.regular,
    width: "90%",
    height: "100%",
    paddingRight: 50,
  },
  searchBtn: {
    width: 50,
    height: "100%",
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 5,
  },
  searchBtnImage: {
    width: "50%",
    height: "50%",
  },
});

export default styles;
