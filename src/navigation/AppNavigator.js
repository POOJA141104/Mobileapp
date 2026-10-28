import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { useApp } from '../context/AppContext';

// Auth Screens
import LaunchScreen from '../screens/auth/LaunchScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import AnalysisScreen from '../screens/main/AnalysisScreen';
import TransactionsScreen from '../screens/main/TransactionsScreen';
import CategoriesScreen from '../screens/main/CategoriesScreen';
import CategoryDetailsScreen from '../screens/main/CategoryDetailsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import AddExpenseScreen from '../screens/main/AddExpenseScreen';
import NotificationScreen from '../screens/main/NotificationScreen';
import SecurityScreen from '../screens/main/SecurityScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import HelpFAQsScreen from '../screens/main/HelpFAQsScreen';
import AdminDashboardScreen from '../screens/main/AdminDashboardScreen';

// Custom Navigation Components
import CustomTabBar from './CustomTabBar';
import CustomDrawerContent from './CustomDrawerContent';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const AuthStack = createNativeStackNavigator();

// 1. Bottom Tabs Navigator (Part II - ii)
function HomeTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Analysis" component={AnalysisScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 2. Drawer Navigator (Part II - iii)
function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '78%',
          maxWidth: 320,
          backgroundColor: '#1E40AF',
        },
        drawerType: 'front',
        overlayColor: 'rgba(15, 23, 42, 0.6)',
      }}
    >
      <Drawer.Screen name="HomeTabs" component={HomeTabs} />
      <Drawer.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Drawer.Screen name="Notifications" component={NotificationScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="HelpFAQs" component={HelpFAQsScreen} />
    </Drawer.Navigator>
  );
}

// 3. Auth Stack
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Launch" component={LaunchScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// 4. Root Stack Navigator (Part II - i)
export default function AppNavigator() {
  const { isAuthenticated } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainDrawer} />
            <Stack.Screen
              name="CategoryDetails"
              component={CategoryDetailsScreen}
            />
            <Stack.Screen
              name="AddExpense"
              component={AddExpenseScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="HelpFAQs" component={HelpFAQsScreen} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

