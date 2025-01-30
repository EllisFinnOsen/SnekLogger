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
        avdName: "Pixel_9_API_35",
      },
    },
  },
  configurations: {
    "android.emu.debug": {
      device: "emulator",
      app: "android.debug",
      testRunner: {
        $0: "jest",
        args: {
          config: "e2e/jest.config.js",
        },
      },
      behavior: {
        launchApp: "auto",
        cleanup: true,
      },
    },
  },
};
