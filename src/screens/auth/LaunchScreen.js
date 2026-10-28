import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function LaunchScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 24) + 16,
          paddingBottom: Math.max(insets.bottom, 24) + 16,
        },
      ]}
    >
      {/* Upper Pooja Branding Section */}
      <View style={styles.brandContainer}>
        {/* Custom Pooja Bar Graph Logo */}
        <View style={styles.logoWrapper}>
          <View style={styles.chartBarIcon}>
            <View style={[styles.bar, { height: 26, backgroundColor: '#1E40AF' }]} />
            <View style={[styles.bar, { height: 44, backgroundColor: '#2563EB' }]} />
            <View style={[styles.bar, { height: 62, backgroundColor: '#FF6B00' }]} />
            <View style={styles.arrowHead}>
              <Ionicons name="arrow-up" size={28} color="#FF6B00" />
            </View>
          </View>
        </View>

        <Text style={styles.appName}>Pooja</Text>
        <Text style={styles.tagline}>
          Smart Personal Finance & Budget Management in Indian Rupees (₹)
        </Text>
      </View>

      {/* Bottom Action Card */}
      <View style={styles.actionsCard}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SignUp')}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF5FF',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  brandContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  logoWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  chartBarIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 70,
    position: 'relative',
    paddingRight: 10,
  },
  bar: {
    width: 14,
    backgroundColor: '#1E40AF',
    marginHorizontal: 3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  arrowHead: {
    position: 'absolute',
    top: -12,
    right: -10,
    transform: [{ rotate: '45deg' }],
  },
  appName: {
    fontSize: 38,
    fontWeight: '800',
    color: '#1E40AF',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#1E3A8A',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    opacity: 0.85,
  },
  actionsCard: {
    width: '100%',
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#FF6B00',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#DBEAFE',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  secondaryButtonText: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '700',
  },
  forgotBtn: {
    alignItems: 'center',
  },
  forgotText: {
    color: '#1E40AF',
    fontSize: 13,
    fontWeight: '600',
  },
});

