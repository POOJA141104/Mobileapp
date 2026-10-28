import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function CustomDrawerContent({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, role, switchRole, logout } = useApp();

  const handleRoleToggle = () => {
    const nextRole = role === 'Admin' ? 'Customer' : 'Admin';
    switchRole(nextRole);
  };

  const navItems = [
    {
      label: 'Home Dashboard',
      icon: 'home-outline',
      action: () => navigation.navigate('HomeTabs', { screen: 'Home' }),
    },
    {
      label: 'Financial Analysis',
      icon: 'stats-chart-outline',
      action: () => navigation.navigate('HomeTabs', { screen: 'Analysis' }),
    },
    {
      label: 'Transactions (Month Wise)',
      icon: 'swap-horizontal-outline',
      action: () => navigation.navigate('HomeTabs', { screen: 'Transactions' }),
    },
    {
      label: 'Overall Categories',
      icon: 'layers-outline',
      action: () => navigation.navigate('HomeTabs', { screen: 'Categories' }),
    },
    {
      label: 'Profile & Edit Profile',
      icon: 'person-outline',
      action: () => navigation.navigate('HomeTabs', { screen: 'Profile' }),
    },
    {
      label: 'Admin Console',
      icon: 'shield-checkmark-outline',
      action: () => navigation.navigate('AdminDashboard'),
      highlight: true,
    },
    {
      label: 'Notifications & Alerts',
      icon: 'notifications-outline',
      action: () => navigation.navigate('Notifications'),
    },
    {
      label: 'Settings & Security',
      icon: 'settings-outline',
      action: () => navigation.navigate('Settings'),
    },
    {
      label: 'Help & FAQs',
      icon: 'help-circle-outline',
      action: () => navigation.navigate('HelpFAQs'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Top Drawer Header with User Profile */}
      <View
        style={[
          styles.headerSection,
          {
            paddingTop: Math.max(insets.top, 24) + 16,
          },
        ]}
      >
        <View style={styles.userProfileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitialText}>
              {user.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.userTextCol}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user.email}
            </Text>
            <View style={styles.roleBadgeContainer}>
              <View
                style={[
                  styles.roleBadge,
                  role === 'Admin' ? styles.adminBadge : styles.customerBadge,
                ]}
              >
                <Text style={styles.roleBadgeText}>{role}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Role Switcher Button */}
        <TouchableOpacity
          style={styles.switchRoleButton}
          onPress={handleRoleToggle}
          activeOpacity={0.8}
        >
          <Ionicons name="repeat" size={16} color="#FFFFFF" />
          <Text style={styles.switchRoleText}>
            Switch Mode: {role === 'Admin' ? 'Customer' : 'Admin'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation List Items */}
      <ScrollView
        style={styles.menuScroll}
        contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {navItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, item.highlight && styles.highlightMenuItem]}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.menuItemIconCircle,
                item.highlight && { backgroundColor: 'rgba(255, 107, 0, 0.3)' },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={item.highlight ? '#FF8A00' : '#BFDBFE'}
              />
            </View>
            <Text
              style={[
                styles.menuItemText,
                item.highlight && { color: '#FF8A00', fontWeight: '800' },
              ]}
            >
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#93C5FD" />
          </TouchableOpacity>
        ))}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            logout();
          }}
          activeOpacity={0.8}
        >
          <View style={styles.logoutIconCircle}>
            <Ionicons name="log-out-outline" size={20} color="#E53E3E" />
          </View>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Drawer Footer with Examination Info */}
      <View
        style={[
          styles.footerSection,
          {
            paddingBottom: Math.max(insets.bottom, 16) + 12,
          },
        ]}
      >
        <Text style={styles.footerAppTitle}>Pooja Budget Tracker</Text>
        <Text style={styles.footerNote}>
          MCA 2025 Semester III • EoS Examinations Oct 2026
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E40AF',
  },
  headerSection: {
    backgroundColor: '#172554',
    paddingHorizontal: 18,
    paddingBottom: 18,
    borderBottomRightRadius: 28,
  },
  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitialText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userTextCol: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 12,
    color: '#BFDBFE',
    marginTop: 2,
  },
  roleBadgeContainer: {
    marginTop: 6,
    flexDirection: 'row',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  customerBadge: {
    backgroundColor: '#FFEDD5',
  },
  adminBadge: {
    backgroundColor: '#FF6B00',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E3A8A',
    textTransform: 'uppercase',
  },
  switchRoleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF6B00',
    paddingVertical: 9,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  switchRoleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  menuScroll: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  highlightMenuItem: {
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
  },
  menuItemIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  logoutIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FCA5A5',
  },
  footerSection: {
    paddingHorizontal: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  footerAppTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerNote: {
    fontSize: 10,
    color: '#BFDBFE',
    marginTop: 2,
  },
});

