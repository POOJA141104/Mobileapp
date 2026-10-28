import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function PersonalizedAlert() {
  const insets = useSafeAreaInsets();
  const { activeAlert, dismissAlert } = useApp();
  const slideAnim = useRef(new Animated.Value(-120)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeAlert) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: Math.max(insets.top, 24) + 12,
          useNativeDriver: true,
          tension: 60,
          friction: 9,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -120,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activeAlert, insets.top]);

  if (!activeAlert) return null;

  const isWarning = activeAlert.type === 'warning';
  const isInfo = activeAlert.type === 'info';

  const iconName = isWarning
    ? 'warning-outline'
    : isInfo
    ? 'information-circle-outline'
    : 'checkmark-circle-outline';

  const accentColor = isWarning ? '#FF7A45' : isInfo ? '#1E40AF' : '#FF6B00';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={[styles.card, { borderLeftColor: accentColor }]}>
        <View style={[styles.iconContainer, { backgroundColor: `${accentColor}1A` }]}>
          <Ionicons name={iconName} size={24} color={accentColor} />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{activeAlert.title}</Text>
            <Text style={styles.timestamp}>{activeAlert.timestamp}</Text>
          </View>
          <Text style={styles.message}>{activeAlert.message}</Text>
        </View>

        <TouchableOpacity onPress={dismissAlert} style={styles.closeButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close" size={18} color="#718096" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 8,
    borderLeftWidth: 5,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E1065',
  },
  timestamp: {
    fontSize: 11,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  message: {
    fontSize: 12,
    color: '#4A5568',
    lineHeight: 17,
  },
  closeButton: {
    padding: 4,
    alignSelf: 'flex-start',
  },
});

