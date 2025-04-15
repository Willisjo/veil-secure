import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Use Expo's registerRootComponent for web support
registerRootComponent(App);

// Also register with AppRegistry for native platforms
AppRegistry.registerComponent(appName, () => App);
