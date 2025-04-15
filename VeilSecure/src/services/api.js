// API service for VeilVPN
import { isTestModeEnabled, simulateDelay } from '../utils/testMode';

// Environment configuration
// Development: Use localhost
// Android Emulator: Use 10.0.2.2
// Physical Android device: Use your computer's actual IP address
const ENV = {
  DEV: 'http://localhost:3000/api',
  ANDROID_EMULATOR: 'http://10.0.2.2:3000/api',
  // Change this to your computer's IP address when testing on a physical device
  PHYSICAL_DEVICE: 'http://192.168.1.1:3000/api' 
};

// Select the appropriate API URL based on your environment
// For development testing in browser, use ENV.DEV
// For Android Emulator testing, use ENV.ANDROID_EMULATOR
// For physical device testing, use ENV.PHYSICAL_DEVICE
const API_URL = ENV.DEV;

/**
 * Fetch all available VPN servers
 * @returns {Promise<Array>} List of server objects
 */
export const fetchServers = async () => {
  try {
    // If test mode is enabled, use local server data
    if (isTestModeEnabled()) {
      console.log('[TEST MODE] Fetching servers from local data');
      await simulateDelay();
      // Import the server data directly
      const { servers } = await import('../utils/serverData');
      return servers;
    }

    console.log(`Fetching servers from: ${API_URL}/servers`);
    const response = await fetch(`${API_URL}/servers`);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching servers:', error);
    return []; // Return empty array on error
  }
};

/**
 * Login as admin (simplified - in production use proper auth)
 * @param {string} username - Admin username
 * @param {string} password - Admin password
 * @returns {Promise<Object>} Auth result object with success flag and token if successful
 */
export const adminLogin = async (username, password) => {
  // In a real app, you would POST to a login endpoint
  // This is a simplified implementation for demonstration
  if (username === 'admin' && password === 'admin123') {
    return { 
      success: true, 
      token: 'admin-token' 
    };
  }
  return { 
    success: false, 
    error: 'Invalid credentials' 
  };
};

/**
 * Fetch stats for admin dashboard
 * @param {string} token - Admin auth token
 * @returns {Promise<Object>} Stats object
 */
export const fetchAdminStats = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: {
        'x-admin-access': 'true' // In production, use a proper auth token
      }
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return { error: 'Failed to fetch stats' };
  }
};

/**
 * Fetch all active sessions (for admin)
 * @param {string} token - Admin auth token
 * @returns {Promise<Array>} List of session objects
 */
export const fetchSessions = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/sessions`, {
      headers: {
        'x-admin-access': 'true' // In production, use a proper auth token
      }
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return []; // Return empty array on error
  }
};

/**
 * Add a new server (admin only)
 * @param {Object} server - The server data to add
 * @param {string} token - Admin auth token
 * @returns {Promise<Object>} The created server
 */
export const addServer = async (server, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/servers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-access': 'true' // In production, use a proper auth token
      },
      body: JSON.stringify(server)
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding server:', error);
    return { error: 'Failed to add server' };
  }
};

/**
 * Update server details (admin only)
 * @param {number} id - The server ID
 * @param {Object} updates - The updates to apply
 * @param {string} token - Admin auth token
 * @returns {Promise<Object>} The updated server
 */
export const updateServer = async (id, updates, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/servers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-access': 'true' // In production, use a proper auth token
      },
      body: JSON.stringify(updates)
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating server:', error);
    return { error: 'Failed to update server' };
  }
};

/**
 * Delete a server (admin only)
 * @param {number} id - The server ID
 * @param {string} token - Admin auth token
 * @returns {Promise<Object>} Result object
 */
export const deleteServer = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/admin/servers/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-access': 'true' // In production, use a proper auth token
      }
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting server:', error);
    return { error: 'Failed to delete server' };
  }
};