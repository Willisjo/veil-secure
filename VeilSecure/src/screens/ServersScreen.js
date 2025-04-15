import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import CountryItem from '../components/CountryItem';
import PremiumBadge from '../components/PremiumBadge';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { metrics } from '../theme/metrics';
import { selectServer } from '../store/slices/vpnSlice';
import { servers } from '../utils/serverData';

const ServersScreen = () => {
  const dispatch = useDispatch();
  const { selectedServer, isConnected } = useSelector(state => state.vpn);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'free', 'premium'

  const filteredServers = servers
    .filter(server => {
      const matchesSearch =
        server.country.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === 'all') return matchesSearch;
      if (activeTab === 'free') return matchesSearch && !server.isPremium;
      if (activeTab === 'premium') return matchesSearch && server.isPremium;
      
      return matchesSearch;
    })
    .sort((a, b) => {
      // Sort by selected server first, then by premium status, then alphabetically
      if (selectedServer && a.id === selectedServer.id) return -1;
      if (selectedServer && b.id === selectedServer.id) return 1;
      
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      
      return a.country.localeCompare(b.country);
    });

  const handleSelectServer = (server) => {
    if (isConnected) return; // Don't allow changing server while connected
    dispatch(selectServer(server));
  };

  const renderSectionHeader = (title, count) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Server Selection" />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.lightGrey} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search servers..."
            placeholderTextColor={colors.lightGrey}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.lightGrey} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'all' && styles.activeTabText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'free' && styles.activeTab]}
            onPress={() => setActiveTab('free')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'free' && styles.activeTabText,
              ]}
            >
              Free
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'premium' && styles.activeTab]}
            onPress={() => setActiveTab('premium')}
          >
            <View style={styles.premiumTabContent}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'premium' && styles.activeTabText,
                ]}
              >
                Premium
              </Text>
              <PremiumBadge style={styles.smallPremiumBadge} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Server List */}
        <FlatList
          data={filteredServers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CountryItem
              country={item.country}
              flag={item.flag}
              isPremium={item.isPremium}
              isSelected={selectedServer && selectedServer.id === item.id}
              pingSpeed={item.ping}
              onPress={() => handleSelectServer(item)}
              disabled={isConnected}
            />
          )}
          ListHeaderComponent={() => 
            renderSectionHeader(
              activeTab === 'all' 
                ? 'All Servers' 
                : activeTab === 'free' 
                  ? 'Free Servers'
                  : 'Premium Servers',
              filteredServers.length
            )
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={50} color={colors.lightGrey} />
              <Text style={styles.emptyText}>No servers found</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navyBlue,
    borderRadius: metrics.borderRadius,
    marginHorizontal: metrics.margin,
    marginTop: metrics.margin,
    paddingHorizontal: metrics.padding,
    height: 50,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    marginLeft: metrics.margin / 2,
    fontSize: fonts.size.medium,
    height: '100%',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: metrics.margin,
    marginVertical: metrics.margin,
  },
  tab: {
    flex: 1,
    paddingVertical: metrics.padding / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.lightGrey,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
  activeTabText: {
    color: colors.primary,
  },
  premiumTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallPremiumBadge: {
    marginLeft: 5,
    transform: [{ scale: 0.8 }],
  },
  listContent: {
    paddingHorizontal: metrics.padding,
    paddingBottom: metrics.padding * 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.margin,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.bold,
  },
  countBadge: {
    backgroundColor: colors.navyBlue,
    borderRadius: metrics.borderRadius,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: metrics.margin / 2,
  },
  countText: {
    color: colors.white,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.semiBold,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: metrics.padding * 4,
  },
  emptyText: {
    color: colors.lightGrey,
    fontSize: fonts.size.medium,
    marginTop: metrics.margin,
  },
});

export default ServersScreen;
