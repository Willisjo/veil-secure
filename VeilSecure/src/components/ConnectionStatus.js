import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { metrics } from '../theme/metrics';

const ConnectionStatus = ({ isConnected, selectedServer, connectionTime }) => {
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isConnected) {
      // Pulse animation for connected state
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Reset animation when disconnected
      pulseAnimation.setValue(1);
      
      // Rotation animation for disconnected
      Animated.loop(
        Animated.timing(rotateAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }

    return () => {
      pulseAnimation.stopAnimation();
      rotateAnimation.stopAnimation();
    };
  }, [isConnected]);

  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Animated.View
          style={[
            styles.statusIndicator,
            isConnected ? styles.connected : styles.disconnected,
            {
              transform: isConnected
                ? [{ scale: pulseAnimation }]
                : [{ rotate }],
            },
          ]}
        >
          <Ionicons
            name={isConnected ? 'shield' : 'shield-outline'}
            size={50}
            color={isConnected ? colors.primary : colors.lightGrey}
          />
        </Animated.View>
        <Text style={styles.statusText}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
        {isConnected && selectedServer && (
          <>
            <Text style={styles.serverInfo}>
              {selectedServer.flag} {selectedServer.country}
            </Text>
            <Text style={styles.timeInfo}>
              Connected for {connectionTime}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: metrics.padding * 2,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: metrics.margin,
  },
  connected: {
    backgroundColor: colors.darkBlue,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disconnected: {
    backgroundColor: colors.darkGrey,
    borderWidth: 2,
    borderColor: colors.lightGrey,
  },
  statusText: {
    color: colors.white,
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.bold,
    marginBottom: metrics.margin / 2,
  },
  serverInfo: {
    color: colors.lightGrey,
    fontSize: fonts.size.medium,
    marginBottom: metrics.margin / 2,
  },
  timeInfo: {
    color: colors.lightGrey,
    fontSize: fonts.size.small,
  },
});

export default ConnectionStatus;
