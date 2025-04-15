import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { metrics } from '../theme/metrics';

const PaymentSuccessScreen = () => {
  const navigation = useNavigation();

  // Enable back handler
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleContinue = () => {
    // Navigate to home or servers screen
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Confirmation</Text>
          <View style={styles.rightPlaceholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </View>

          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.subtitle}>
            Thank you for upgrading to Veil VPN Premium. You now have access to all premium servers
            and features.
          </Text>

          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Premium Benefits:</Text>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.benefitText}>Access to all premium server locations</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.benefitText}>Faster connection speeds</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.benefitText}>No bandwidth limitations</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.benefitText}>Priority customer support</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
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
    padding: metrics.padding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.white,
  },
  backButton: {
    padding: 8,
  },
  rightPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.lightGrey,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  detailsContainer: {
    backgroundColor: colors.darkBlue,
    borderRadius: metrics.borderRadius,
    padding: metrics.padding,
    marginBottom: 32,
    width: '100%',
  },
  detailsTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.white,
    marginBottom: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.white,
    marginLeft: 10,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: metrics.borderRadius,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
});

export default PaymentSuccessScreen;