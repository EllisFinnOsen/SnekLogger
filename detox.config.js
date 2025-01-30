module.exports = {
  testRunner: "jest",
  runnerConfig: "e2e/config.json",
  configurations: {
    "android.emu.debug": {
      device: "emulator",
      app: "android",
      build:
        "npx expo prebuild && gradlew.bat -p android assembleDebug assembleAndroidTest",
    },
  },
};
