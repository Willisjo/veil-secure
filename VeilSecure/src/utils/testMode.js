// Test mode configuration for VeilVPN

/**
 * Test mode settings
 * When enabled, the application will use mock data for testing purposes
 * Useful for Android Studio testing without connecting to external services
 */
export const TEST_MODE = {
  // Master toggle for test mode
  enabled: false,
  
  // Test mode options
  options: {
    // Skip actual API calls for payments and return mock success responses
    mockPayments: true,
    
    // Force all servers to show as available regardless of backend status
    allServersAvailable: true,
    
    // Simulate premium access for testing premium features
    simulatePremium: false,
    
    // Add artificial delay to API calls to simulate network latency (in ms)
    apiDelay: 300,
    
    // Log all network requests to console for debugging
    logNetworkRequests: true
  },
  
  // Stripe test card numbers for reference
  stripeTestCards: {
    success: '4242 4242 4242 4242',
    declineGeneric: '4000 0000 0000 0002',
    declineInsufficient: '4000 0000 0000 9995',
    requires3dSecure: '4000 0000 0000 3220'
  }
};

/**
 * Helper function to simulate API delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after the delay
 */
export const simulateDelay = (ms = TEST_MODE.options.apiDelay) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Mock payment response for test mode
 * @returns {Object} Mock payment intent object
 */
export const getMockPaymentIntent = () => {
  return {
    clientSecret: 'pi_' + Math.random().toString(36).substring(2, 15) + '_secret_' + Math.random().toString(36).substring(2, 15),
    id: 'pi_' + Math.random().toString(36).substring(2, 15),
    status: 'succeeded'
  };
};

/**
 * Mock subscription response for test mode
 * @returns {Object} Mock subscription object
 */
export const getMockSubscription = () => {
  const mockId = 'sub_' + Math.random().toString(36).substring(2, 15);
  return {
    id: mockId,
    status: 'active',
    current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
    plan: {
      id: 'premium_plan',
      amount: 9.99,
      currency: 'usd',
      interval: 'month'
    },
    clientSecret: 'pi_' + Math.random().toString(36).substring(2, 15) + '_secret_' + Math.random().toString(36).substring(2, 15)
  };
};

/**
 * Helper function to check if test mode is enabled
 * @returns {boolean} True if test mode is enabled
 */
export const isTestModeEnabled = () => TEST_MODE.enabled;