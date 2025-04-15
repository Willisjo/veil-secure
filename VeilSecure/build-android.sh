#!/bin/bash

# Exit on error
set -e

echo "========================================="
echo "VeilVPN Android Build Preparation Script"
echo "========================================="

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
  echo "Error: ANDROID_HOME environment variable is not set."
  echo "Please set ANDROID_HOME to point to your Android SDK installation."
  exit 1
fi

echo "✓ Android SDK found at $ANDROID_HOME"

# Check for required tools
echo "Checking for required tools..."
command -v npx >/dev/null 2>&1 || { echo "Error: npx is required but not installed."; exit 1; }
echo "✓ npx found"

echo "Installing required packages..."
npm install

echo "Building Android project..."
# Generate the Android native project
npx expo prebuild --platform android --clean

echo "========================================="
echo "Android build preparation complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Open Android Studio"
echo "2. Click 'Open an existing project'"
echo "3. Navigate to the 'android' folder in this project and open it"
echo "4. Connect your Android device or start an emulator"
echo "5. Click the 'Run' button in Android Studio"
echo ""
echo "Remember to update the API endpoints in 'src/services/api.js' and 'src/services/paymentApi.js':"
echo "- For Android Emulator: Use API_BASE_URL = ENV.ANDROID_EMULATOR"
echo "- For Physical Device: Update the IP address in ENV.PHYSICAL_DEVICE and use it"
echo ""
echo "For testing Stripe payments, use these test cards:"
echo "- Success: 4242 4242 4242 4242"
echo "- Decline: 4000 0000 0000 0002"
echo "========================================="