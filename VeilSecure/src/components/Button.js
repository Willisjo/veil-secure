import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { metrics } from '../theme/metrics';

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  type = 'primary',
  icon = null,
  style = {},
}) => {
  const buttonStyles = [
    styles.button,
    type === 'primary' && styles.primary,
    type === 'secondary' && styles.secondary,
    type === 'outline' && styles.outline,
    type === 'danger' && styles.danger,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    type === 'outline' && styles.outlineText,
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={type === 'outline' ? colors.primary : colors.white} />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: metrics.borderRadius,
    paddingVertical: metrics.padding,
    paddingHorizontal: metrics.padding * 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 50,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.navyBlue,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.error,
  },
  disabled: {
    backgroundColor: colors.lightGrey,
  },
  text: {
    color: colors.white,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
    marginLeft: metrics.margin / 2,
  },
  outlineText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.mediumGrey,
  },
});

export default Button;
