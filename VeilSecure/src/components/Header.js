import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { metrics } from '../theme/metrics';
import VeilVPNLogo from '../assets/VeilVPNLogo';

const Header = ({ title, showBack = false, onBackPress, rightIcon, onRightPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
        ) : (
          <VeilVPNLogo width={32} height={32} />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {rightIcon && (
        <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
          <Ionicons name={rightIcon} size={24} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.padding,
    backgroundColor: colors.navyBlue,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: metrics.margin / 2,
  },
  title: {
    color: colors.white,
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.bold,
    marginLeft: metrics.margin / 2,
  },
  rightButton: {
    padding: metrics.padding / 2,
  },
});

export default Header;
