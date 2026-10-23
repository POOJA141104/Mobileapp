import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export const Header = ({
  title,
  subtitle,
  showBack = false,
  showCart = true,
  showDrawer = true,
  rightAction,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { cart, userRole, switchUserRole } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLeftPress = () => {
    if (showBack) {
      navigation.goBack();
    } else if (showDrawer && navigation.openDrawer) {
      navigation.openDrawer();
    }
  };

  // Ensure safe area padding for notch, dynamic island, and status bar
  const safeTopPadding = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 14) + 6;

  return (
    <View style={[styles.headerContainer, { paddingTop: safeTopPadding }]}>
      <View style={styles.leftRow}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleLeftPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </TouchableOpacity>
        ) : (
          showDrawer && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleLeftPress}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={26} color={colors.textDark} />
            </TouchableOpacity>
          )
        )}

        <View style={styles.titleArea}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightRow}>
        {/* Role Badge - Tapping it switches role easily */}
        <TouchableOpacity
          style={[
            styles.roleBadge,
            {
              backgroundColor:
                userRole === 'admin' ? colors.adminBadgeLight : colors.customerBadgeLight,
            },
          ]}
          onPress={() => switchUserRole(userRole === 'admin' ? 'customer' : 'admin')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.roleText,
              { color: userRole === 'admin' ? colors.adminBadge : colors.customerBadge },
            ]}
          >
            {userRole.toUpperCase()}
          </Text>
        </TouchableOpacity>

        {rightAction}

        {showCart && (
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={24} color={colors.textDark} />
            {totalCartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {totalCartCount > 99 ? '99+' : totalCartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDark,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 2,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
