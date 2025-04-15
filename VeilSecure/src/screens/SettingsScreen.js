import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Button from '../components/Button';
import TestModeToggle from '../components/TestModeToggle';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { metrics } from '../theme/metrics';

const SettingsItem = ({ icon, title, description, type, value, onValueChange }) => {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description ? <Text style={styles.settingDescription}>{description}</Text> : null}
      </View>
      <View style={styles.settingControl}>
        {type === 'switch' && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: colors.darkGrey, true: colors.primary }}
            thumbColor={value ? colors.white : colors.lightGrey}
          />
        )}
        {type === 'button' && (
          <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
        )}
      </View>
    </View>
  );
};

const SettingsScreen = () => {
  const { isConnected } = useSelector(state => state.vpn);
  
  // Settings state
  const [autoConnect, setAutoConnect] = useState(false);
  const [killSwitch, setKillSwitch] = useState(true);
  const [splitTunneling, setSplitTunneling] = useState(false);
  const [dnsPref, setDnsPref] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const navigation = useNavigation();
  
  const handleUpgradeToPremium = () => {
    Alert.alert(
      'Upgrade to Premium',
      'Access all premium servers and features with Veil VPN Premium subscription.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Subscribe Now', 
          onPress: () => navigation.navigate('Subscription')
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Settings" />
        
        <ScrollView style={styles.scrollView}>
          {/* Premium Card */}
          <View style={styles.premiumCard}>
            <View style={styles.premiumContent}>
              <Ionicons name="star" size={30} color={colors.gold} />
              <View style={styles.premiumTextContainer}>
                <Text style={styles.premiumTitle}>Go Premium</Text>
                <Text style={styles.premiumDescription}>
                  Get unlimited access to all premium servers and features
                </Text>
              </View>
            </View>
            <Button
              title="Upgrade"
              type="secondary"
              onPress={handleUpgradeToPremium}
              style={styles.upgradeButton}
            />
          </View>

          {/* VPN Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>VPN Settings</Text>
            
            <SettingsItem
              icon="flash"
              title="Auto-Connect"
              description="Connect automatically when app starts"
              type="switch"
              value={autoConnect}
              onValueChange={setAutoConnect}
            />
            
            <SettingsItem
              icon="shield-checkmark"
              title="Kill Switch"
              description="Block internet if VPN disconnects"
              type="switch"
              value={killSwitch}
              onValueChange={setKillSwitch}
            />
            
            <SettingsItem
              icon="git-branch"
              title="Split Tunneling"
              description="Choose apps to bypass VPN"
              type="switch"
              value={splitTunneling}
              onValueChange={setSplitTunneling}
            />
            
            <SettingsItem
              icon="globe"
              title="DNS Preferences"
              description="Use Veil VPN secure DNS"
              type="switch"
              value={dnsPref}
              onValueChange={setDnsPref}
            />
          </View>

          {/* App Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            
            <SettingsItem
              icon="notifications"
              title="Notifications"
              description="Receive alerts and updates"
              type="switch"
              value={notifications}
              onValueChange={setNotifications}
            />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon.')}
            >
              <View style={styles.settingIconContainer}>
                <Ionicons name="color-palette" size={22} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Appearance</Text>
                <Text style={styles.settingDescription}>Dark mode and themes</Text>
              </View>
              <View style={styles.settingControl}>
                <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => Alert.alert('Languages', 'Language settings coming soon.')}
            >
              <View style={styles.settingIconContainer}>
                <Ionicons name="language" size={22} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Language</Text>
                <Text style={styles.settingDescription}>English</Text>
              </View>
              <View style={styles.settingControl}>
                <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => Alert.alert('Help Center', 'Our help resources are coming soon.')}
            >
              <View style={styles.settingIconContainer}>
                <Ionicons name="help-circle" size={22} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Help Center</Text>
              </View>
              <View style={styles.settingControl}>
                <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => Alert.alert('Contact Us', 'Send us your feedback at support@veilvpn.com')}
            >
              <View style={styles.settingIconContainer}>
                <Ionicons name="mail" size={22} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Contact Us</Text>
              </View>
              <View style={styles.settingControl}>
                <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => Alert.alert('Privacy Policy', 'Our privacy policy details are coming soon.')}
            >
              <View style={styles.settingIconContainer}>
                <Ionicons name="lock-closed" size={22} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Privacy Policy</Text>
              </View>
              <View style={styles.settingControl}>
                <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => Alert.alert('Terms of Service', 'Our terms of service details are coming soon.')}
            >
              <View style={styles.settingIconContainer}>
                <Ionicons name="document-text" size={22} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Terms of Service</Text>
              </View>
              <View style={styles.settingControl}>
                <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Developer Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Developer</Text>
            <TestModeToggle />
            
            <TouchableOpacity 
              style={[styles.settingItem, { marginTop: 10 }]}
              onPress={() => navigation.navigate('Debug')}
            >
              <View style={styles.settingIconContainer}>
                <Ionicons name="code-working" size={22} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Debug Console</Text>
                <Text style={styles.settingDescription}>View diagnostic information</Text>
              </View>
              <View style={styles.settingControl}>
                <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.versionText}>Veil VPN v1.0.0</Text>
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
  premiumCard: {
    backgroundColor: colors.navyBlue,
    margin: metrics.margin,
    borderRadius: metrics.borderRadius,
    padding: metrics.padding,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.margin,
  },
  premiumTextContainer: {
    marginLeft: metrics.margin,
    flex: 1,
  },
  premiumTitle: {
    color: colors.white,
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.bold,
    marginBottom: 4,
  },
  premiumDescription: {
    color: colors.lightGrey,
    fontSize: fonts.size.small,
  },
  upgradeButton: {
    backgroundColor: colors.darkBlue,
  },
  section: {
    marginHorizontal: metrics.margin,
    marginBottom: metrics.margin * 2,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.bold,
    marginBottom: metrics.margin,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkBlue,
    padding: metrics.padding,
    borderRadius: metrics.borderRadius,
    marginBottom: metrics.margin / 2,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.margin,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: colors.white,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
    marginBottom: 2,
  },
  settingDescription: {
    color: colors.lightGrey,
    fontSize: fonts.size.small,
  },
  settingControl: {
    marginLeft: metrics.margin,
  },
  footer: {
    padding: metrics.padding * 2,
    alignItems: 'center',
  },
  versionText: {
    color: colors.lightGrey,
    fontSize: fonts.size.small,
  },
});

export default SettingsScreen;
