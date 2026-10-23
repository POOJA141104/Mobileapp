import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator } from './TabNavigator';
import { ProductsListScreen } from '../screens/ProductsListScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CustomDrawerContent } from './CustomDrawerContent';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  const { userRole } = useApp();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primaryDark,
        drawerActiveBackgroundColor: colors.primaryLight,
        drawerInactiveTintColor: colors.textDark,
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          marginLeft: -10,
        },
        drawerItemStyle: {
          borderRadius: 12,
          paddingHorizontal: 6,
          marginVertical: 3,
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{
          drawerLabel: 'Daily Grocery Shop',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="FavoritesDrawer"
        component={FavoritesScreen}
        options={{
          drawerLabel: 'My Favorites Wishlist',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="CartDrawer"
        component={CartScreen}
        options={{
          drawerLabel: 'My Shopping Cart',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="ProfileDrawer"
        component={ProfileScreen}
        options={{
          drawerLabel: userRole === 'admin' ? 'Admin Profile' : 'Customer Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name={userRole === 'admin' ? 'shield-checkmark-outline' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

