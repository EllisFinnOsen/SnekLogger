/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: "jest",
      config: "e2e/jest.config.js",
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    "android.debug": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      build: "cd android && ./gradlew assembleDebug",
    },
  },
  devices: {
    emulator: {
      type: "android.emulator",
      device: {
        avdName: "Pixel_3a_API_30_x86",
      },
    },
  },
  configurations: {
    "android.metro.debug": {
      device: "emulator",
      app: "android.debug",
    },
  },
};
