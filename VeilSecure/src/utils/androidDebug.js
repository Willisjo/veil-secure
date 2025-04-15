/**
 * Android-specific debugging utilities for VeilVPN
 * These utilities help with debugging on Android Studio
 */

import logger from './logger';

/**
 * Check if the app is running on Android
 * @returns {boolean} True if running on Android
 */
export const isAndroid = () => {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return true;
  }
  return false;
};

/**
 * Log device information to help with debugging
 * This would be expanded with real device info in a native implementation
 */
export const logDeviceInfo = () => {
  logger.group('Device Information');
  
  logger.info('Checking device information...', 'AndroidDebug');
  
  // In a real implementation, this would use React Native's Platform API
  const deviceInfo = {
    platform: isAndroid() ? 'Android' : 'Web/Other',
    // These would be populated with real values in a native app
    osVersion: 'Unknown',
    deviceModel: 'Unknown',
    appVersion: '1.0.0',
    buildNumber: '1',
  };
  
  logger.logObject(deviceInfo, 'Device Info', 'AndroidDebug');
  logger.groupEnd();
  
  return deviceInfo;
};

/**
 * Log network information to debug connectivity issues
 */
export const logNetworkInfo = async () => {
  logger.group('Network Information');
  
  logger.info('Checking network status...', 'AndroidDebug');
  
  // In a real implementation, this would use React Native's NetInfo
  const networkInfo = {
    isConnected: true,
    type: 'wifi',
    details: {
      isConnectionExpensive: false,
      cellularGeneration: null,
    }
  };
  
  logger.logObject(networkInfo, 'Network Info', 'AndroidDebug');
  logger.groupEnd();
  
  return networkInfo;
};

/**
 * Log memory usage information
 */
export const logMemoryUsage = () => {
  logger.group('Memory Usage');
  
  logger.info('Checking memory usage...', 'AndroidDebug');
  
  // This would use performance API in a real implementation
  const memoryInfo = {
    jsHeapSizeLimit: 'Unknown',
    totalJSHeapSize: 'Unknown',
    usedJSHeapSize: 'Unknown',
  };
  
  logger.logObject(memoryInfo, 'Memory Info', 'AndroidDebug');
  logger.groupEnd();
  
  return memoryInfo;
};

/**
 * Check and log the status of permissions
 * This is particularly important for VPN apps on Android
 */
export const checkPermissions = () => {
  logger.group('Permissions');
  
  logger.info('Checking permissions...', 'AndroidDebug');
  
  // This would use React Native's PermissionsAndroid in a real implementation
  const permissions = {
    vpnService: 'Unknown',
    internet: 'Granted', // Internet permission is implied
    readExternalStorage: 'Unknown',
    writeExternalStorage: 'Unknown',
    foregroundService: 'Unknown',
  };
  
  logger.logObject(permissions, 'Permissions Status', 'AndroidDebug');
  logger.groupEnd();
  
  return permissions;
};

/**
 * Run a basic connectivity test to ensure network requests can be made
 */
export const testConnectivity = async () => {
  logger.group('Connectivity Test');
  
  try {
    logger.info('Testing connectivity...', 'AndroidDebug');
    logger.startPerformanceTimer('connectivityTest');
    
    // We'll make a simple fetch request to test connectivity
    const response = await fetch('https://www.google.com');
    const status = response.status;
    
    logger.endPerformanceTimer('connectivityTest');
    logger.info(`Connectivity test result: Status ${status}`, 'AndroidDebug');
    
    logger.groupEnd();
    return { success: true, status };
  } catch (error) {
    logger.endPerformanceTimer('connectivityTest');
    logger.error('Connectivity test failed', error, 'AndroidDebug');
    
    logger.groupEnd();
    return { success: false, error: error.message };
  }
};

/**
 * Run a full diagnostics report
 */
export const runDiagnostics = async () => {
  logger.info('Starting full diagnostics...', 'AndroidDebug');
  
  const results = {
    deviceInfo: logDeviceInfo(),
    networkInfo: await logNetworkInfo(),
    memoryUsage: logMemoryUsage(),
    permissions: checkPermissions(),
    connectivity: await testConnectivity(),
    timestamp: new Date().toISOString(),
  };
  
  logger.info('Diagnostics complete', 'AndroidDebug');
  return results;
};

// Export a debug object for convenience
const androidDebug = {
  isAndroid,
  logDeviceInfo,
  logNetworkInfo,
  logMemoryUsage,
  checkPermissions,
  testConnectivity,
  runDiagnostics,
};

export default androidDebug;