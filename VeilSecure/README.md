# Veil VPN

A stylish mobile VPN application with free and premium country servers using a red, blue, and grey color scheme.

## Features

- Clean, modern UI with intuitive navigation
- Server selection by country
- Free and premium server options
- Secure payment processing with Stripe
- Server status indicators
- Connection statistics

## Tech Stack

- React Native with Expo
- Redux for state management
- React Navigation
- Stripe for payments
- PostgreSQL database with Drizzle ORM
- Express server

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm run server
```

3. Start the client:
```bash
npm start
```

## Android Studio Setup

To test the app in Android Studio, follow these steps:

### Prerequisites

1. Install Android Studio
2. Install the Android SDK
3. Set up environment variables
   - ANDROID_HOME pointing to your Android SDK location
   - Add platform-tools to your PATH

### Generate Android Project

1. Create the Android native files:
```bash
npx expo prebuild --platform android
```

2. Open the project in Android Studio:
   - Launch Android Studio
   - Select "Open an existing project"
   - Navigate to the `android` folder in your project directory

### Configure API Endpoints

When running on an Android device or emulator, update the API endpoints in:
- `src/services/api.js`
- `src/services/paymentApi.js`

Use one of the following:
- For emulator: `10.0.2.2` instead of `localhost`
- For physical device: Your computer's local IP address

### Test Stripe Payments

Use these test cards for Stripe:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Expiration date: Any future date
- CVC: Any 3 digits

## Deployment

The application is set up for deployment using Expo's EAS Build service.

```bash
npm install -g eas-cli
eas build:configure
eas build --platform android
```

## License

This project is proprietary software. All rights reserved.