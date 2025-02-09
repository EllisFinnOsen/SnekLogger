#!/usr/bin/env bash

set -eox pipefail

# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash
export PATH="$PATH":"$HOME/.maestro/bin"

# Set the correct executable path based on the platform
if [ "$EAS_BUILD_PLATFORM" = "ios" ]
then
   brew install java
   echo 'export PATH="/opt/homebrew/opt/openjdk/bin:$PATH"' >> ~/.zshrc
   sudo ln -sfn /opt/homebrew/opt/openjdk/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk
   export CPPFLAGS="-I/opt/homebrew/opt/openjdk/include"

   APP_EXECUTABLE_PATH="/Users/expo/workingdir/build/ios/build/Build/Products/Release-iphonesimulator/MaestroEasExample.app"
else
   APP_EXECUTABLE_PATH="/home/expo/workingdir/build/android/app/build/outputs/apk/release/app-release.apk"
fi

# Debugging: List the Maestro directory to check if the test file exists
echo "Checking Maestro test file location..."
ls -la /home/expo/workingdir/build/maestro/

# Check if the Maestro test file exists before running the command
MAESTRO_TEST_FILE="/home/expo/workingdir/build/maestro/home.yml"

if [ ! -f "$MAESTRO_TEST_FILE" ]; then
    echo "❌ ERROR: Maestro test file not found at $MAESTRO_TEST_FILE"
    exit 1
fi

# Use absolute path and check API key
if [ -z "$MAESTRO_CLOUD_API_KEY" ]; then
    echo "❌ ERROR: MAESTRO_CLOUD_API_KEY is not set!"
    exit 1
fi

# Run Maestro with absolute path
maestro cloud --apiKey "$MAESTRO_CLOUD_API_KEY" "$APP_EXECUTABLE_PATH" "$MAESTRO_TEST_FILE"
