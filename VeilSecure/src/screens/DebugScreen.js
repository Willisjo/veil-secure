import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { metrics } from '../theme/metrics';
import logger, { LOG_LEVEL } from '../utils/logger';
import androidDebug from '../utils/androidDebug';
import { isTestModeEnabled } from '../utils/testMode';

// Debug section component
const DebugSection = ({ title, children, initiallyExpanded = false }) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  
  return (
    <View style={styles.section}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={colors.lightGrey} 
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );
};

// Debug info row component
const DebugInfoRow = ({ label, value, isHighlighted = false }) => {
  return (
    <View style={[styles.infoRow, isHighlighted && styles.highlightedRow]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text 
        style={[
          styles.infoValue, 
          typeof value === 'boolean' && (value ? styles.successText : styles.errorText)
        ]}
      >
        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value.toString()}
      </Text>
    </View>
  );
};

// Action button component
const ActionButton = ({ title, onPress, icon, isLoading = false }) => {
  return (
    <TouchableOpacity 
      style={styles.actionButton}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <>
          <Ionicons name={icon} size={16} color={colors.white} style={styles.actionIcon} />
          <Text style={styles.actionButtonText}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const DebugScreen = () => {
  const navigation = useNavigation();
  const [diagnosticsResult, setDiagnosticsResult] = useState(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [currentLogLevel, setCurrentLogLevel] = useState(LOG_LEVEL.INFO);
  const [stripeStatus, setStripeStatus] = useState({
    clientSecret: null,
    paymentMethods: [],
    lastError: null,
  });
  
  // Run diagnostics
  const handleRunDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    logger.info('Running diagnostics from Debug Screen', 'DebugScreen');
    
    try {
      const results = await androidDebug.runDiagnostics();
      setDiagnosticsResult(results);
      logger.info('Diagnostics completed successfully', 'DebugScreen');
    } catch (error) {
      logger.error('Error running diagnostics', error, 'DebugScreen');
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  // Check Stripe status
  const checkStripeStatus = async () => {
    logger.info('Checking Stripe status', 'DebugScreen');
    
    try {
      if (typeof window !== 'undefined' && window.Stripe) {
        setStripeStatus({
          ...stripeStatus,
          loaded: true,
          message: 'Stripe.js is loaded'
        });
      } else {
        setStripeStatus({
          ...stripeStatus,
          loaded: false,
          message: 'Stripe.js is not loaded'
        });
      }
    } catch (error) {
      logger.error('Error checking Stripe status', error, 'DebugScreen');
      setStripeStatus({
        ...stripeStatus,
        loaded: false,
        lastError: error.message
      });
    }
  };
  
  // Cycle through log levels
  const changeLogLevel = () => {
    const levels = Object.values(LOG_LEVEL);
    const currentIndex = levels.indexOf(currentLogLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    const nextLevel = levels[nextIndex];
    
    logger.setLogLevel(nextLevel);
    setCurrentLogLevel(nextLevel);
    
    // Log a message at each level to demonstrate
    logger.debug('Debug message', 'DebugScreen');
    logger.info('Info message', 'DebugScreen');
    logger.warn('Warning message', 'DebugScreen');
    logger.error('Error message', 'DebugScreen');
  };
  
  // Get log level name from enum value
  const getLogLevelName = (level) => {
    return Object.keys(LOG_LEVEL).find(key => LOG_LEVEL[key] === level) || 'UNKNOWN';
  };
  
  // Run initial diagnostics on mount
  useEffect(() => {
    logger.info('Debug screen mounted', 'DebugScreen');
    handleRunDiagnostics();
    checkStripeStatus();
    
    return () => {
      logger.info('Debug screen unmounted', 'DebugScreen');
    };
  }, []);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Developer Debug" />
        
        <ScrollView style={styles.scrollView}>
          <DebugSection title="App Information" initiallyExpanded={true}>
            <DebugInfoRow label="App Version" value="1.0.0" />
            <DebugInfoRow label="Build Number" value="1" />
            <DebugInfoRow label="Environment" value={isTestModeEnabled() ? 'Test Mode' : 'Production'} />
            <DebugInfoRow 
              label="Log Level" 
              value={getLogLevelName(currentLogLevel)} 
              isHighlighted={true}
            />
            
            <View style={styles.actionsContainer}>
              <ActionButton 
                title="Change Log Level" 
                icon="swap-vertical" 
                onPress={changeLogLevel} 
              />
              <ActionButton 
                title="Run Diagnostics" 
                icon="refresh" 
                onPress={handleRunDiagnostics}
                isLoading={isRunningDiagnostics} 
              />
            </View>
          </DebugSection>
          
          <DebugSection title="Network Status">
            {diagnosticsResult?.networkInfo ? (
              <>
                <DebugInfoRow 
                  label="Connected" 
                  value={diagnosticsResult.networkInfo.isConnected} 
                />
                <DebugInfoRow 
                  label="Connection Type" 
                  value={diagnosticsResult.networkInfo.type} 
                />
                <DebugInfoRow 
                  label="API Reachable" 
                  value={diagnosticsResult.connectivity.success} 
                />
                
                <View style={styles.actionsContainer}>
                  <ActionButton 
                    title="Test API Connection" 
                    icon="globe" 
                    onPress={async () => {
                      const result = await androidDebug.testConnectivity();
                      setDiagnosticsResult({
                        ...diagnosticsResult,
                        connectivity: result
                      });
                    }} 
                  />
                </View>
              </>
            ) : (
              <Text style={styles.loadingText}>Loading network information...</Text>
            )}
          </DebugSection>
          
          <DebugSection title="VPN Status">
            <DebugInfoRow label="VPN Permission" value="Unknown" />
            <DebugInfoRow label="VPN Connected" value={false} />
            <DebugInfoRow label="Current Server" value="None" />
            <DebugInfoRow label="Connection Time" value="0s" />
            
            <View style={styles.actionsContainer}>
              <ActionButton 
                title="Check VPN Permission" 
                icon="shield-checkmark" 
                onPress={() => {
                  logger.info('Checking VPN permission (placeholder)', 'DebugScreen');
                }} 
              />
            </View>
          </DebugSection>
          
          <DebugSection title="Stripe Integration">
            <DebugInfoRow 
              label="Stripe.js Loaded" 
              value={stripeStatus.loaded || false} 
            />
            <DebugInfoRow 
              label="Test Mode Active" 
              value={isTestModeEnabled()} 
              isHighlighted={true}
            />
            <DebugInfoRow 
              label="Last Error" 
              value={stripeStatus.lastError || 'None'} 
            />
            
            <View style={styles.actionsContainer}>
              <ActionButton 
                title="Check Stripe Status" 
                icon="card" 
                onPress={checkStripeStatus} 
              />
              <ActionButton 
                title="Test Payment Intent" 
                icon="cash" 
                onPress={() => {
                  navigation.navigate('Subscription');
                }} 
              />
            </View>
          </DebugSection>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              All diagnostic information is available in the console logs
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.darkGrey,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.darkBlue,
    borderRadius: metrics.borderRadius,
    marginHorizontal: metrics.margin,
    marginBottom: metrics.margin,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: metrics.padding,
  },
  sectionTitle: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  sectionContent: {
    padding: metrics.padding,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
  },
  highlightedRow: {
    backgroundColor: colors.navyBlue,
  },
  infoLabel: {
    color: colors.lightGrey,
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  infoValue: {
    color: colors.white,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  successText: {
    color: colors.success,
  },
  errorText: {
    color: colors.error,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: metrics.borderRadius / 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 4,
  },
  actionButtonText: {
    color: colors.white,
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  loadingText: {
    color: colors.lightGrey,
    fontFamily: fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: metrics.padding * 2,
  },
  footerText: {
    color: colors.lightGrey,
    fontFamily: fonts.regular,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default DebugScreen;