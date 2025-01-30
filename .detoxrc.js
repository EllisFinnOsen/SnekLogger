module.exports = {
  runner: {
    jest: {
      config: "e2e/config.json",
    },
  },

  apps: {
    "android.expo": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      build:
        "npx expo prebuild && cd android && gradlew.bat assembleDebug assembleAndroidTest",
    },
  },

  devices: {
    "android.emulator": {
      type: "android.emulator",
      device: {
        avdName: "Pixel_4_API_30",
      },
    },
  },

  configurations: {
    "android.emu.debug": {
      device: "android.emulator",
      app: "android.expo",
    },
  },
};
