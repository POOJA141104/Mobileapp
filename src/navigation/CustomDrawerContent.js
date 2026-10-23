import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export const CustomDrawerContent = (props) => {
  const insets = useSafeAreaInsets();
  const { currentUser, userRole, logout, cart, favoriteIds } =
    useApp();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = () => {
    logout();
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Drawer User Header */}
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 20) + 12 },
        ]}
      >
        <View
          style={[
            styles.avatar,
            userRole === 'admin' && {
              backgroundColor: colors.adminBadgeLight,
              borderColor: '#DDD6FE',
            },
          ]}
        >
          <Ionicons
            name={
              userRole === 'admin'
                ? 'shield-checkmark'
                : currentUser.avatarLogo || 'basket'
            }
            size={28}
            color={userRole === 'admin' ? colors.adminBadge : colors.primaryDark}
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {userRole === 'admin' ? 'Unnikrishnan' : currentUser.name}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {currentUser.email}
          </Text>

          <View style={styles.roleRow}>
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor:
                    userRole === 'admin'
                      ? colors.adminBadgeLight
                      : colors.customerBadgeLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  {
                    color:
                      userRole === 'admin'
                        ? colors.adminBadge
                        : colors.customerBadge,
                  },
                ]}
              >
                {userRole.toUpperCase()} ACCOUNT
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Nav List */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerList}>
        <DrawerItemList {...props} />

        <View style={styles.divider} />

        {/* <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>RVS CAS - MCA Model Exam</Text>
          <Text style={styles.infoSub}>Duration: 6 Hours • Marks: 75</Text>
          <Text style={styles.infoFeature}>• Stack + Tab + Drawer Navigation</Text>
          <Text style={styles.infoFeature}>• Admin & Customer Dual Role</Text>
          <Text style={styles.infoFeature}>• Live Cart & Favorites Engine</Text>
        </View> */}
      </DrawerContentScrollView>

      {/* Drawer Footer / Sign Out */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 45,
    backgroundColor: colors.surfaceSubtle,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: '#A7F3D0',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    marginBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  roleRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  drawerList: {
    paddingTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 14,
    marginHorizontal: 16,
  },
  infoBox: {
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
  },
  infoSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 6,
  },
  infoFeature: {
    fontSize: 10,
    color: colors.textMedium,
    marginTop: 2,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: '#fff',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.dangerLight,
    gap: 10,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
});

