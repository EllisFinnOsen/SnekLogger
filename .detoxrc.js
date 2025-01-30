module.exports = {
  apps: {
    "android.debug": {
      type: "android.apk",
      build:
        "cd android && gradlew.bat assembleDebug assembleAndroidTest -Dorg.gradle.warning.mode=summary --no-daemon --console=plain",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      testBinaryPath:
        "android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk",
    },
  },
  devices: {
    emulator: {
      type: "android.emulator",
      device: {
        avdName: "Pixel_4_API_30", // Match your CI emulator name
      },
    },
  },
  configurations: {
    "android.emu.debug": {
      device: "emulator",
      app: "android.debug",
      runner: {
        testRunner: "jest",
        config: "e2e/config.json",
      },
      behavior: {
        launchApp: "auto",
        cleanup: true,
      },
    },
  },
};
