import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { metrics } from '../theme/metrics';

const ServerStats = ({ downloadSpeed, uploadSpeed, ping }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Ionicons name="arrow-down-outline" size={20} color={colors.primary} />
        <View>
          <Text style={styles.statValue}>{downloadSpeed} Mbps</Text>
          <Text style={styles.statLabel}>Download</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statItem}>
        <Ionicons name="arrow-up-outline" size={20} color={colors.navyBlue} />
        <View>
          <Text style={styles.statValue}>{uploadSpeed} Mbps</Text>
          <Text style={styles.statLabel}>Upload</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statItem}>
        <Ionicons name="timer-outline" size={20} color={colors.lightGrey} />
        <View>
          <Text style={styles.statValue}>{ping} ms</Text>
          <Text style={styles.statLabel}>Ping</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.darkGrey,
    borderRadius: metrics.borderRadius,
    padding: metrics.padding,
    marginHorizontal: metrics.margin,
    marginBottom: metrics.margin,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    color: colors.white,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
    marginLeft: metrics.margin / 2,
  },
  statLabel: {
    color: colors.lightGrey,
    fontSize: fonts.size.small,
    marginLeft: metrics.margin / 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderGrey,
  },
});

export default ServerStats;
