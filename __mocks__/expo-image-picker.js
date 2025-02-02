module.exports = {
  requestMediaLibraryPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "granted" }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ cancelled: true }),
};
