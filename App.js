import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ToastMessage } from './src/components/ToastMessage';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer documentTitle={{ formatter: () => 'FreshMart Grocery' }}>
            <View style={styles.appContainer}>
              <StatusBar style="dark" />
              <ToastMessage />
              <RootNavigator />
            </View>
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
