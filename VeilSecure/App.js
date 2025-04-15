import React from 'react';
import { StatusBar, SafeAreaView, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/store';
import { colors } from './src/theme/colors';

// Ignore specific warnings that might be coming from dependencies
LogBox.ignoreLogs(['Remote debugger']);

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={colors.navyBlue} />
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkGrey }}>
          <AppNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
