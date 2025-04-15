import { isTestModeEnabled, simulateDelay, getMockPaymentIntent, getMockSubscription } from '../utils/testMode';
import logger from '../utils/logger';

// Environment configuration
// Development: Use localhost
// Android Emulator: Use 10.0.2.2
// Physical Android device: Use your computer's actual IP address
const ENV = {
  DEV: 'http://localhost:3000',
  ANDROID_EMULATOR: 'http://10.0.2.2:3000',
  // Change this to your computer's IP address when testing on a physical device
  PHYSICAL_DEVICE: 'http://192.168.1.1:3000' 
};

// Select the appropriate API URL based on your environment
// For development testing in browser, use ENV.DEV
// For Android Emulator testing, use ENV.ANDROID_EMULATOR
// For physical device testing, use ENV.PHYSICAL_DEVICE
const API_BASE_URL = ENV.DEV;

/**
 * Create a payment intent for processing a payment
 * @param {number} amount - The amount to charge in dollars
 * @returns {Promise<Object>} Object containing client secret for payment processing
 */
export const createPaymentIntent = async (amount) => {
  try {
    // If test mode is enabled, return mock data
    if (isTestModeEnabled()) {
      logger.info(`[TEST MODE] Creating mock payment intent for amount: ${amount}`, 'paymentApi');
      await simulateDelay();
      return getMockPaymentIntent();
    }

    // Log network request in development
    console.log(`Creating payment intent: ${API_BASE_URL}/api/create-payment-intent`, { amount });
    
    const response = await fetch(`${API_BASE_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Server error details:', errorData);
      throw new Error(`Failed to create payment intent: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Payment intent created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Fetch available subscription plans
 * @returns {Promise<Array>} Array of available subscription plans
 */
export const getSubscriptionPlans = async () => {
  try {
    // If test mode is enabled, return mock data
    if (isTestModeEnabled()) {
      console.log('[TEST MODE] Returning mock subscription plans');
      await simulateDelay();
      return [
        {
          id: 'price_monthly',
          name: 'Monthly Premium',
          amount: 9.99,
          currency: 'usd',
          interval: 'month',
          features: ['All premium servers', 'Faster speeds', 'No bandwidth limits']
        },
        {
          id: 'price_yearly',
          name: 'Yearly Premium (Save 20%)',
          amount: 95.88,
          currency: 'usd',
          interval: 'year',
          features: ['All premium servers', 'Faster speeds', 'No bandwidth limits', '20% discount']
        }
      ];
    }

    // Log network request in development
    console.log(`Fetching subscription plans: ${API_BASE_URL}/api/subscription-plans`);
    
    const response = await fetch(`${API_BASE_URL}/api/subscription-plans`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Server error details:', errorData);
      throw new Error(`Failed to fetch subscription plans: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Subscription plans fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }
};

/**
 * Create a subscription for a user
 * @param {string} priceId - The Stripe price ID for the subscription
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} Object containing subscription details and client secret
 */
export const createSubscription = async (priceId, userId) => {
  try {
    // If test mode is enabled, return mock data
    if (isTestModeEnabled()) {
      console.log('[TEST MODE] Creating mock subscription for user:', userId);
      await simulateDelay();
      return getMockSubscription();
    }

    // Log network request in development
    console.log(`Creating subscription: ${API_BASE_URL}/api/create-subscription`, { priceId, userId });
    
    const response = await fetch(`${API_BASE_URL}/api/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, userId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Server error details:', errorData);
      throw new Error(`Failed to create subscription: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Subscription created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Cancel a user's subscription
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} Result of the cancellation
 */
export const cancelSubscription = async (userId) => {
  try {
    // If test mode is enabled, return mock data
    if (isTestModeEnabled()) {
      console.log('[TEST MODE] Cancelling mock subscription for user:', userId);
      await simulateDelay();
      return { success: true, message: 'Subscription cancelled successfully' };
    }

    // Log network request in development
    console.log(`Cancelling subscription: ${API_BASE_URL}/api/cancel-subscription`, { userId });
    
    const response = await fetch(`${API_BASE_URL}/api/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Server error details:', errorData);
      throw new Error(`Failed to cancel subscription: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Subscription cancelled successfully:', data);
    return data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};