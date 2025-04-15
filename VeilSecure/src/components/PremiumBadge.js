import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { metrics } from '../theme/metrics';

const PremiumBadge = ({ style = {} }) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="star" size={10} color={colors.gold} />
      <Text style={styles.text}>PREMIUM</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.premiumBadge,
    paddingHorizontal: metrics.padding / 2,
    paddingVertical: 2,
    borderRadius: metrics.borderRadius / 2,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  text: {
    color: colors.gold,
    fontSize: fonts.size.tiny,
    fontWeight: fonts.weight.bold,
    marginLeft: 2,
  },
});

export default PremiumBadge;
