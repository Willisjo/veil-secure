import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Button from '../components/Button';
import ConnectionStatus from '../components/ConnectionStatus';
import ServerStats from '../components/ServerStats';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { metrics } from '../theme/metrics';
import { connectVpn, disconnectVpn } from '../store/slices/vpnSlice';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { 
    isConnected, 
    isConnecting, 
    selectedServer, 
    connectionStartTime 
  } = useSelector(state => state.vpn);
  const [connectionTime, setConnectionTime] = useState('00:00:00');

  // Calculate connection time
  useEffect(() => {
    let interval;
    if (isConnected && connectionStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now - connectionStartTime;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setConnectionTime(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    } else {
      setConnectionTime('00:00:00');
    }

    return () => clearInterval(interval);
  }, [isConnected, connectionStartTime]);

  const handleConnectPress = () => {
    if (isConnected) {
      dispatch(disconnectVpn());
    } else {
      if (selectedServer) {
        dispatch(connectVpn());
      } else {
        navigation.navigate('Servers');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header 
          title="Veil VPN" 
          rightIcon="notifications-outline"
          onRightPress={() => {}}
        />
        
        <ScrollView style={styles.scrollView}>
          {/* Connection Status */}
          <ConnectionStatus 
            isConnected={isConnected} 
            selectedServer={selectedServer}
            connectionTime={connectionTime}
          />

          {/* Connection Button */}
          <Button
            title={isConnected ? 'Disconnect' : (selectedServer ? 'Connect' : 'Select Server')}
            type={isConnected ? 'danger' : 'primary'}
            onPress={handleConnectPress}
            loading={isConnecting}
            icon={
              <Ionicons
                name={isConnected ? 'power' : 'shield'}
                size={20}
                color={colors.white}
                style={{ marginRight: metrics.margin / 2 }}
              />
            }
            style={styles.connectButton}
          />

          {/* Server Stats */}
          {isConnected && (
            <ServerStats
              downloadSpeed="96.5"
              uploadSpeed="42.3"
              ping="32"
            />
          )}

          {/* VPN Info Cards */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <Ionicons name="shield-checkmark" size={40} color={colors.primary} style={styles.infoIcon} />
              <Text style={styles.infoTitle}>Secure Connection</Text>
              <Text style={styles.infoDescription}>
                Your data is encrypted and your IP is hidden from trackers
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="globe" size={40} color={colors.navyBlue} style={styles.infoIcon} />
              <Text style={styles.infoTitle}>Global Access</Text>
              <Text style={styles.infoDescription}>
                Connect to servers in 60+ countries around the world
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="flash" size={40} color={colors.primary} style={styles.infoIcon} />
              <Text style={styles.infoTitle}>High-Speed Servers</Text>
              <Text style={styles.infoDescription}>
                Enjoy fast and reliable connections for streaming and browsing
              </Text>
            </View>
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
  connectButton: {
    marginHorizontal: metrics.margin * 2,
    marginBottom: metrics.margin,
  },
  infoCardsContainer: {
    paddingHorizontal: metrics.padding,
    paddingBottom: metrics.padding * 2,
    marginTop: metrics.margin,
  },
  infoCard: {
    backgroundColor: colors.darkBlue,
    borderRadius: metrics.borderRadius,
    padding: metrics.padding * 1.5,
    marginBottom: metrics.margin,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  infoIcon: {
    marginBottom: metrics.margin,
  },
  infoTitle: {
    color: colors.white,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.bold,
    marginBottom: metrics.margin / 2,
  },
  infoDescription: {
    color: colors.lightGrey,
    fontSize: fonts.size.small,
    lineHeight: 20,
  },
});

export default HomeScreen;
