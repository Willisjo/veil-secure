import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const metrics = {
  // Screen dimensions
  screenWidth: width,
  screenHeight: height,
  
  // Padding and margin
  padding: 15,
  margin: 15,
  
  // Border radius
  borderRadius: 12,
  buttonRadius: 25,
  
  // Icon sizes
  iconTiny: 15,
  iconSmall: 20,
  iconMedium: 30,
  iconLarge: 45,
  
  // Image dimensions
  smallImageSize: 30,
  mediumImageSize: 50,
  largeImageSize: 100,
  
  // Header height
  headerHeight: Platform.OS === 'ios' ? 64 : 56,
  
  // Tab bar height
  tabBarHeight: 60,
  
  // Is iOS platform
  isIOS: Platform.OS === 'ios',
};
