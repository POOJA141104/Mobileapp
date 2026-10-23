import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthHomeScreen } from '../screens/AuthHomeScreen';
import { DrawerNavigator } from './DrawerNavigator';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { CartScreen } from '../screens/CartScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* 1. Auth Stack Screen: Home with Sign In and Sign Up */}
      <Stack.Screen name="Auth" component={AuthHomeScreen} />

      {/* 2. Main App: Drawer Navigation + Bottom Tabs Navigation */}
      <Stack.Screen name="MainApp" component={DrawerNavigator} />

      {/* 3. Stack Screens: Product Details Screen (Screen 5) */}
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          animation: 'fade_from_bottom',
        }}
      />

      {/* Direct Stack Accessible Screens */}
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

