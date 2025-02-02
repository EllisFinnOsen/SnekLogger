console.log("expo-image-picker mock loaded");

module.exports = {
  requestMediaLibraryPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "granted" }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ cancelled: true }),
  requestCameraPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "granted" }),
  launchCameraAsync: jest.fn().mockResolvedValue({ cancelled: true }),
};
