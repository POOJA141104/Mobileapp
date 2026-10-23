import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { ProductsListScreen } from '../screens/ProductsListScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { cart, favoriteIds, userRole } = useApp();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: colors.borderLight,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Products"
        component={ProductsListScreen}
        options={{
          tabBarLabel: 'Groceries',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'basket' : 'basket-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarBadge: favoriteIds.length > 0 ? favoriteIds.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.danger,
            fontSize: 10,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'My Cart',
          tabBarBadge: totalCartCount > 0 ? totalCartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            fontSize: 10,
            fontWeight: 'bold',
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'cart' : 'cart-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: userRole === 'admin' ? 'Superadmin' : 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={
                userRole === 'admin'
                  ? focused
                    ? 'shield-checkmark'
                    : 'shield-checkmark-outline'
                  : focused
                  ? 'person'
                  : 'person-outline'
              }
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

