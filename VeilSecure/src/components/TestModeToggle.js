import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { TEST_MODE } from '../utils/testMode';

const TestModeToggle = () => {
  const [isEnabled, setIsEnabled] = useState(TEST_MODE.enabled);
  const [showModal, setShowModal] = useState(false);
  const [options, setOptions] = useState(TEST_MODE.options);

  useEffect(() => {
    // Update the global TEST_MODE object when settings change
    TEST_MODE.enabled = isEnabled;
    TEST_MODE.options = { ...options };
  }, [isEnabled, options]);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };

  const toggleOption = (option) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      [option]: !prevOptions[option]
    }));
  };

  const updateDelayValue = (value) => {
    // Ensure the value is a number and within reasonable bounds
    const delay = Math.max(0, Math.min(5000, parseInt(value) || 0));
    setOptions(prevOptions => ({
      ...prevOptions,
      apiDelay: delay
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Test Mode</Text>
        <TouchableOpacity 
          style={styles.infoButton} 
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="information-circle-outline" size={20} color={colors.lightGrey} />
        </TouchableOpacity>
        <Switch
          trackColor={{ false: colors.borderGrey, true: colors.primary }}
          thumbColor={isEnabled ? colors.white : colors.lightGrey}
          ios_backgroundColor={colors.borderGrey}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      {isEnabled && (
        <View style={styles.optionsContainer}>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>Mock Payments</Text>
            <Switch
              trackColor={{ false: colors.borderGrey, true: colors.primary }}
              thumbColor={options.mockPayments ? colors.white : colors.lightGrey}
              ios_backgroundColor={colors.borderGrey}
              onValueChange={() => toggleOption('mockPayments')}
              value={options.mockPayments}
              style={styles.smallSwitch}
            />
          </View>
          
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>All Servers Available</Text>
            <Switch
              trackColor={{ false: colors.borderGrey, true: colors.primary }}
              thumbColor={options.allServersAvailable ? colors.white : colors.lightGrey}
              ios_backgroundColor={colors.borderGrey}
              onValueChange={() => toggleOption('allServersAvailable')}
              value={options.allServersAvailable}
              style={styles.smallSwitch}
            />
          </View>
          
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>Simulate Premium</Text>
            <Switch
              trackColor={{ false: colors.borderGrey, true: colors.primary }}
              thumbColor={options.simulatePremium ? colors.white : colors.lightGrey}
              ios_backgroundColor={colors.borderGrey}
              onValueChange={() => toggleOption('simulatePremium')}
              value={options.simulatePremium}
              style={styles.smallSwitch}
            />
          </View>
          
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>Log Network Requests</Text>
            <Switch
              trackColor={{ false: colors.borderGrey, true: colors.primary }}
              thumbColor={options.logNetworkRequests ? colors.white : colors.lightGrey}
              ios_backgroundColor={colors.borderGrey}
              onValueChange={() => toggleOption('logNetworkRequests')}
              value={options.logNetworkRequests}
              style={styles.smallSwitch}
            />
          </View>
          
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>API Delay (ms)</Text>
            <View style={styles.delayControls}>
              <TouchableOpacity 
                style={styles.delayButton} 
                onPress={() => updateDelayValue(options.apiDelay - 100)}
              >
                <Text style={styles.delayButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.delayValue}>{options.apiDelay}</Text>
              <TouchableOpacity 
                style={styles.delayButton} 
                onPress={() => updateDelayValue(options.apiDelay + 100)}
              >
                <Text style={styles.delayButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Test Mode Information</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalSectionTitle}>Purpose</Text>
              <Text style={styles.modalText}>
                Test Mode allows you to use the app without connecting to actual backend services,
                which is useful for Android Studio testing without setting up a server.
              </Text>
              
              <Text style={styles.modalSectionTitle}>Options</Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Mock Payments:</Text> Uses simulated Stripe payments instead of real ones.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>All Servers Available:</Text> Makes all servers show as online.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Simulate Premium:</Text> Grants access to premium servers for testing.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Log Network Requests:</Text> Logs all API calls to the console.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>API Delay:</Text> Adds artificial latency to simulate network conditions.
              </Text>
              
              <Text style={styles.modalSectionTitle}>Test Cards</Text>
              <View style={styles.cardContainer}>
                <Text style={styles.cardLabel}>Success:</Text>
                <Text style={styles.cardNumber}>{TEST_MODE.stripeTestCards.success}</Text>
              </View>
              <View style={styles.cardContainer}>
                <Text style={styles.cardLabel}>Decline:</Text>
                <Text style={styles.cardNumber}>{TEST_MODE.stripeTestCards.declineGeneric}</Text>
              </View>
              <View style={styles.cardContainer}>
                <Text style={styles.cardLabel}>Insufficient Funds:</Text>
                <Text style={styles.cardNumber}>{TEST_MODE.stripeTestCards.declineInsufficient}</Text>
              </View>
              <View style={styles.cardContainer}>
                <Text style={styles.cardLabel}>3D Secure:</Text>
                <Text style={styles.cardNumber}>{TEST_MODE.stripeTestCards.requires3dSecure}</Text>
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkBlue,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.white,
    flex: 1,
  },
  infoButton: {
    marginRight: 10,
  },
  optionsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  optionText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.lightGrey,
  },
  smallSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  delayControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  delayButton: {
    backgroundColor: colors.navyBlue,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delayButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  delayValue: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.white,
    marginHorizontal: 10,
    minWidth: 40,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: colors.darkGrey,
    borderRadius: 10,
    padding: 20,
    width: '85%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.white,
  },
  modalScrollView: {
    marginBottom: 15,
  },
  modalSectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.primary,
    marginTop: 15,
    marginBottom: 5,
  },
  modalText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.lightGrey,
    marginBottom: 10,
  },
  boldText: {
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  cardContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  cardLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.white,
    width: 140,
  },
  cardNumber: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.lightGrey,
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
});

export default TestModeToggle;