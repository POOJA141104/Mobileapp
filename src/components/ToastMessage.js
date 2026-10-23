import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export const ToastMessage = () => {
  const { toast } = useApp();

  if (!toast.visible) return null;

  const getIconAndBg = () => {
    switch (toast.type) {
      case 'danger':
        return { icon: 'alert-circle', bg: colors.danger, text: '#fff' };
      case 'warning':
        return { icon: 'warning', bg: colors.warning, text: '#fff' };
      case 'info':
        return { icon: 'information-circle', bg: '#2563EB', text: '#fff' };
      case 'success':
      default:
        return { icon: 'checkmark-circle', bg: colors.primaryDark, text: '#fff' };
    }
  };

  const { icon, bg, text } = getIconAndBg();

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={[styles.pill, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={text} style={{ marginRight: 8 }} />
        <Text style={[styles.text, { color: text }]}>{toast.message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 40,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: '92%',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
});

