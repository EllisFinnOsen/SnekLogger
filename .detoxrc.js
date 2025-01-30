module.exports = {
  testRunner: "jest",
  runnerConfig: "e2e/config.json",
  apps: {
    "android.debug": {
      type: "android.apk",
      build:
        "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      testBinaryPath:
        "android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk",
    },
  },
  devices: {
    emulator: {
      type: "android.emulator",
      device: {
        avdName: "Pixel_9_API_35",
      },
    },
  },
  configurations: {
    "android.emu.debug": {
      device: "emulator",
      app: "android.debug",
      behavior: {
        launchApp: "auto",
        cleanup: true,
      },
    },
  },
};
