/**
 * Enhanced logging utility for VeilVPN
 * Provides consistent logging for debugging on both web and mobile platforms
 */

// Log levels
export const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4, // No logging
};

// Current log level (can be changed at runtime)
let currentLogLevel = LOG_LEVEL.INFO;

// Whether to include timestamps in logs
let includeTimestamp = true;

// Whether to log to file (for native platforms)
// This requires a native module setup - for Android Studio testing
let logToFile = false;

// Log file path (used only if logToFile is true)
let logFilePath = '';

// Returns formatted timestamp
const getTimestamp = () => {
  const now = new Date();
  return `${now.toISOString()} `;
};

// Format message with optional module name and timestamps
const formatMessage = (level, module, message) => {
  let formattedMsg = '';
  
  if (includeTimestamp) {
    formattedMsg += getTimestamp();
  }
  
  formattedMsg += `[${level}]`;
  
  if (module) {
    formattedMsg += ` [${module}]`;
  }
  
  formattedMsg += `: ${message}`;
  return formattedMsg;
};

// Write log to file if enabled
// Note: This is a placeholder that would need to be implemented
// with a native module for actual file logging on device
const writeToLogFile = (message) => {
  if (logToFile && logFilePath) {
    // This would use a native module to actually write to a file
    // For now, we just console.log a note that we would be logging to file
    console.log(`WOULD LOG TO FILE (${logFilePath}): ${message}`);
  }
};

// Main logging functions
export const debug = (message, module = '') => {
  if (currentLogLevel <= LOG_LEVEL.DEBUG) {
    const formattedMsg = formatMessage('DEBUG', module, message);
    console.debug(formattedMsg);
    writeToLogFile(formattedMsg);
  }
};

export const info = (message, module = '') => {
  if (currentLogLevel <= LOG_LEVEL.INFO) {
    const formattedMsg = formatMessage('INFO', module, message);
    console.info(formattedMsg);
    writeToLogFile(formattedMsg);
  }
};

export const warn = (message, module = '') => {
  if (currentLogLevel <= LOG_LEVEL.WARN) {
    const formattedMsg = formatMessage('WARN', module, message);
    console.warn(formattedMsg);
    writeToLogFile(formattedMsg);
  }
};

export const error = (message, error = null, module = '') => {
  if (currentLogLevel <= LOG_LEVEL.ERROR) {
    let formattedMsg = formatMessage('ERROR', module, message);
    console.error(formattedMsg);
    
    if (error) {
      console.error('Error details:', error);
      
      // Add stack trace if available
      if (error.stack) {
        console.error('Stack trace:', error.stack);
        writeToLogFile(`${formattedMsg}\nStack trace: ${error.stack}`);
      } else {
        writeToLogFile(formattedMsg);
      }
    } else {
      writeToLogFile(formattedMsg);
    }
  }
};

// Log an object with proper formatting
export const logObject = (obj, label = 'Object', module = '') => {
  if (currentLogLevel <= LOG_LEVEL.DEBUG) {
    const formattedMsg = formatMessage('DEBUG', module, `${label}:`);
    console.debug(formattedMsg);
    console.debug(obj);
    
    try {
      const objString = JSON.stringify(obj, null, 2);
      writeToLogFile(`${formattedMsg}\n${objString}`);
    } catch (e) {
      writeToLogFile(`${formattedMsg} (Not serializable)`);
    }
  }
};

// Configuration functions
export const setLogLevel = (level) => {
  if (Object.values(LOG_LEVEL).includes(level)) {
    currentLogLevel = level;
    info(`Log level set to: ${Object.keys(LOG_LEVEL).find(key => LOG_LEVEL[key] === level)}`, 'Logger');
  } else {
    warn(`Invalid log level: ${level}`, 'Logger');
  }
};

export const enableTimestamps = (enable = true) => {
  includeTimestamp = enable;
};

export const enableFileLogging = (enable = true, filePath = '') => {
  logToFile = enable;
  if (enable && filePath) {
    logFilePath = filePath;
    info(`File logging enabled. Path: ${filePath}`, 'Logger');
  } else if (!enable) {
    info('File logging disabled', 'Logger');
  } else {
    warn('File logging enabled but no file path provided', 'Logger');
  }
};

// Group logs for better organization
export const group = (label) => {
  if (currentLogLevel <= LOG_LEVEL.DEBUG) {
    console.group(label);
  }
};

export const groupEnd = () => {
  if (currentLogLevel <= LOG_LEVEL.DEBUG) {
    console.groupEnd();
  }
};

// Performance monitoring
export const startPerformanceTimer = (label) => {
  if (currentLogLevel <= LOG_LEVEL.DEBUG) {
    console.time(label);
    info(`Starting performance timer: ${label}`, 'Performance');
  }
};

export const endPerformanceTimer = (label) => {
  if (currentLogLevel <= LOG_LEVEL.DEBUG) {
    console.timeEnd(label);
    info(`Ended performance timer: ${label}`, 'Performance');
  }
};

// Export a default object for convenience
const logger = {
  debug,
  info,
  warn,
  error,
  logObject,
  setLogLevel,
  enableTimestamps,
  enableFileLogging,
  group,
  groupEnd,
  startPerformanceTimer,
  endPerformanceTimer,
  LOG_LEVEL,
};

export default logger;