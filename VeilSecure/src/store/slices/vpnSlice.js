import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vpnConnect, vpnDisconnect } from '../../utils/vpnService';

// Async thunks
export const connectVpn = createAsyncThunk(
  'vpn/connectVpn',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { selectedServer } = getState().vpn;
      if (!selectedServer) {
        return rejectWithValue('No server selected');
      }
      
      await vpnConnect(selectedServer);
      return new Date(); // Return connection start time
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const disconnectVpn = createAsyncThunk(
  'vpn/disconnectVpn', 
  async () => {
    await vpnDisconnect();
    return null;
  }
);

const initialState = {
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  selectedServer: null,
  connectionStartTime: null,
  lastConnectedServer: null,
};

const vpnSlice = createSlice({
  name: 'vpn',
  initialState,
  reducers: {
    selectServer: (state, action) => {
      state.selectedServer = action.payload;
    },
    clearConnectionError: (state) => {
      state.connectionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Connect VPN
      .addCase(connectVpn.pending, (state) => {
        state.isConnecting = true;
        state.connectionError = null;
      })
      .addCase(connectVpn.fulfilled, (state, action) => {
        state.isConnected = true;
        state.isConnecting = false;
        state.connectionStartTime = action.payload;
        state.lastConnectedServer = state.selectedServer;
      })
      .addCase(connectVpn.rejected, (state, action) => {
        state.isConnecting = false;
        state.connectionError = action.payload;
      })
      
      // Disconnect VPN
      .addCase(disconnectVpn.pending, (state) => {
        // No state changes needed for pending disconnect
      })
      .addCase(disconnectVpn.fulfilled, (state) => {
        state.isConnected = false;
        state.connectionStartTime = null;
      });
  },
});

export const { selectServer, clearConnectionError } = vpnSlice.actions;

export default vpnSlice.reducer;
