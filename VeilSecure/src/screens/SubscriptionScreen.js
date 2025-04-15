import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { metrics } from '../theme/metrics';
import { loadStripe } from '@stripe/stripe-js';
import { getSubscriptionPlans, createPaymentIntent } from '../services/paymentApi';

// Make sure to set this to your Stripe publishable key
const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);

const PricingCard = ({ plan, onSelect, selected }) => {
  return (
    <TouchableOpacity
      style={[
        styles.pricingCard,
        selected && styles.selectedPricingCard
      ]}
      onPress={() => onSelect(plan)}
    >
      <Text style={styles.planName}>{plan.name}</Text>
      <Text style={styles.planPrice}>
        ${plan.price}{plan.interval !== 'one-time' ? `/${plan.interval}` : ''}
      </Text>
      <Text style={styles.planDescription}>{plan.description || 'Access to premium VPN servers'}</Text>
      {selected && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedText}>Selected</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const SubscriptionScreen = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    // Fetch subscription plans from the server using our API service
    getSubscriptionPlans()
      .then(data => {
        setPlans(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching plans:', error);
        setLoading(false);
        
        // If there's an error, add some default plans for display
        setPlans([
          {
            id: 'monthly',
            name: 'VPN Monthly',
            description: 'Access to all premium VPN servers',
            price: 9.99,
            currency: 'usd',
            interval: 'month'
          },
          {
            id: 'yearly',
            name: 'VPN Yearly',
            description: 'Access to all premium VPN servers',
            price: 99.99,
            currency: 'usd',
            interval: 'year'
          }
        ]);
      });
  }, []);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a subscription plan');
      return;
    }

    setPaymentLoading(true);

    try {
      // On web, we'll redirect to the Stripe checkout
      if (Platform.OS === 'web') {
        // Create a payment intent on the server using our API service
        const { clientSecret } = await createPaymentIntent(selectedPlan.price);

        // When the customer clicks on the button, redirect them to Checkout
        const stripe = await stripePromise;
        
        const { error } = await stripe.confirmPayment({
          // Elements instance that was used to create the Payment Element
          elements: null,
          clientSecret,
          confirmParams: {
            // Add the current origin + path to PaymentSuccess screen
            return_url: `${window.location.origin}/payment-success`,
          },
        });

        if (error) {
          Alert.alert('Error', error.message);
        } else {
          // On successful payment, navigate to payment success screen
          navigation.navigate('PaymentSuccess');
        }
      } else {
        // For mobile, we'll use React Navigation to navigate directly to the success screen
        // In a real app, you would process the payment using a native Stripe SDK first
        Alert.alert(
          'Mobile Payment',
          'Would you like to simulate a successful payment?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Yes, Proceed', 
              onPress: () => navigation.navigate('PaymentSuccess')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'There was a problem processing your payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading subscription plans...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium Subscription</Text>
        <View style={styles.rightPlaceholder} />
      </View>
      
      <Text style={styles.title}>VPN Premium Subscription</Text>
      <Text style={styles.subtitle}>
        Choose a subscription plan to access premium servers
      </Text>

      <ScrollView style={styles.plansContainer}>
        {plans.map(plan => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onSelect={handleSelectPlan}
            selected={selectedPlan && selectedPlan.id === plan.id}
          />
        ))}
      </ScrollView>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Premium Features</Text>
        <Text style={styles.feature}>• Access to all premium server locations</Text>
        <Text style={styles.feature}>• Faster connection speeds</Text>
        <Text style={styles.feature}>• No bandwidth limitations</Text>
        <Text style={styles.feature}>• Priority customer support</Text>
      </View>

      <TouchableOpacity 
        style={[
          styles.subscribeButton, 
          !selectedPlan && styles.disabledButton
        ]}
        onPress={handleSubscribe}
        disabled={!selectedPlan || paymentLoading}
      >
        {paymentLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.subscribeButtonText}>
            {selectedPlan ? `Subscribe for $${selectedPlan.price}` : 'Select a plan to subscribe'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: metrics.padding,
    backgroundColor: colors.background,
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
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  plansContainer: {
    marginBottom: 20,
  },
  pricingCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPricingCard: {
    borderColor: colors.primary,
  },
  planName: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: 8,
  },
  planPrice: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.primary,
    marginBottom: 8,
  },
  planDescription: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: '#fff',
  },
  featuresContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  featuresTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: 12,
  },
  feature: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  subscribeButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
    marginTop: 12,
  },
});

export default SubscriptionScreen;