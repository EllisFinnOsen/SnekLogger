import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import StackNavigator from "./navigation/StackNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <StackNavigator />
    </Provider>
  );
}
