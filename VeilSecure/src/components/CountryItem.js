import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { metrics } from '../theme/metrics';
import PremiumBadge from './PremiumBadge';

const CountryItem = ({
  country,
  flag,
  isPremium,
  isSelected,
  pingSpeed,
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        disabled && styles.disabledContainer,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <Text style={styles.flagText}>{flag}</Text>
        <View style={styles.countryInfo}>
          <Text style={styles.countryName}>{country}</Text>
          <View style={styles.pingContainer}>
            <Ionicons name="timer-outline" size={12} color={colors.lightGrey} />
            <Text style={styles.pingText}>{pingSpeed} ms</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        {isPremium && <PremiumBadge style={styles.premiumBadge} />}
        {isSelected && (
          <View style={styles.connectedIndicator}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: metrics.padding,
    backgroundColor: colors.darkGrey,
    borderRadius: metrics.borderRadius,
    marginBottom: metrics.margin,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  selectedContainer: {
    borderColor: colors.primary,
    backgroundColor: colors.darkBlue,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 30,
    marginRight: metrics.margin,
  },
  countryInfo: {
    justifyContent: 'center',
  },
  countryName: {
    color: colors.white,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
  pingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  pingText: {
    color: colors.lightGrey,
    fontSize: fonts.size.small,
    marginLeft: 4,
  },
  premiumBadge: {
    marginRight: metrics.margin / 2,
  },
  connectedIndicator: {
    marginLeft: metrics.margin / 2,
  },
});

export default CountryItem;
