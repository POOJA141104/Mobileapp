import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function Header({
  title,
  subtitle,
  showBack = false,
  showMenu = true,
  showNotification = true,
  navigation,
  backgroundColor = '#1E40AF',
  titleColor = '#FFFFFF',
  style,
}) {
  const insets = useSafeAreaInsets();
  const { notifications, user, switchRole } = useApp();

  const unreadCount = notifications.length;

  const handleMenuPress = () => {
    if (navigation?.openDrawer) {
      navigation.openDrawer();
    }
  };

  const handleBackPress = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  const handleNotificationPress = () => {
    if (navigation?.navigate) {
      navigation.navigate('Notifications');
    }
  };

  const toggleRole = () => {
    const nextRole = user.role === 'Admin' ? 'Customer' : 'Admin';
    switchRole(nextRole);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          // Guarantee safe distance from mobile notch / status bar / dynamic island
          paddingTop: Math.max(insets.top, 24) + 8,
        },
        style,
      ]}
    >
      <View style={styles.contentRow}>
        {/* Left Action: Back Button or Drawer Hamburger */}
        <View style={styles.leftAction}>
          {showBack ? (
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.iconCircleButton}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back" size={24} color="#1E40AF" />
            </TouchableOpacity>
          ) : showMenu ? (
            <TouchableOpacity
              onPress={handleMenuPress}
              style={styles.iconCircleButton}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="menu" size={24} color="#1E40AF" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Center Title / Subtitle */}
        <View style={styles.centerContent}>
          {title ? (
            <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Right Actions: Role Toggle Badge & Notification Bell */}
        <View style={styles.rightAction}>
          {/* Quick role indicator / toggle */}
          <TouchableOpacity
            style={[
              styles.roleBadge,
              user.role === 'Admin' ? styles.adminBadge : styles.customerBadge,
            ]}
            onPress={toggleRole}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.roleBadgeText,
                { color: user.role === 'Admin' ? '#FFFFFF' : '#C2410C' },
              ]}
            >
              {user.role}
            </Text>
          </TouchableOpacity>

          {showNotification && (
            <TouchableOpacity
              onPress={handleNotificationPress}
              style={styles.notificationButton}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="notifications-outline" size={22} color="#1E40AF" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftAction: {
    width: 44,
    alignItems: 'flex-start',
  },
  iconCircleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginTop: 2,
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  roleBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  customerBadge: {
    backgroundColor: '#FFEDD5',
  },
  adminBadge: {
    backgroundColor: '#FF6B00',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E1238',
    textTransform: 'uppercase',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF4D4F',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

