import { configureStore } from '@reduxjs/toolkit';
import vpnReducer from './slices/vpnSlice';

const store = configureStore({
  reducer: {
    vpn: vpnReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in the redux store
        ignoredActions: ['vpn/connectVpn/fulfilled'],
        ignoredPaths: ['vpn.connectionStartTime'],
      },
    }),
});

export default store;
