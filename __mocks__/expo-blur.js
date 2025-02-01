// __mocks__/expo-blur.js
const React = require("react");
const { View } = require("react-native");

// A dummy BlurView that just renders a View.
const BlurView = (props) => <View {...props} />;

module.exports = { BlurView };
