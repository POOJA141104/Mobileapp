import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

export default function NotificationScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { notifications } = useApp();

  // Group notifications
  const grouped = notifications.reduce((acc, curr) => {
    const section = curr.category || 'Today';
    if (!acc[section]) acc[section] = [];
    acc[section].push(curr);
    return acc;
  }, {});

  const sectionKeys = Object.keys(grouped);

  return (
    <View style={styles.container}>
      {/* Notch-Safe Header */}
      <View
        style={[
          styles.headerBanner,
          {
            paddingTop: Math.max(insets.top, 24) + 10,
            paddingBottom: 20,
          },
        ]}
      >
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.navCircleBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#1E1238" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Notification</Text>

          <View style={styles.navCircleBtn}>
            <Ionicons name="notifications" size={20} color="#FF6B00" />
          </View>
        </View>
      </View>

      {/* Curved Sheet Content */}
      <View style={styles.sheetContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom, 20) + 30,
          }}
        >
          {sectionKeys.map((section) => (
            <View key={section} style={styles.sectionGroup}>
              <Text style={styles.sectionHeaderTitle}>{section}</Text>

              {grouped[section].map((item) => (
                <View key={item.id} style={styles.notificationItem}>
                  {/* Left Icon */}
                  <View style={styles.iconCircle}>
                    <Ionicons name={item.icon || 'notifications'} size={20} color="#FF6B00" />
                  </View>

                  {/* Body Content */}
                  <View style={styles.contentCol}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemMessage}>{item.message}</Text>
                    <Text style={styles.itemTimestamp}>{item.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E40AF',
  },
  headerBanner: {
    paddingHorizontal: 20,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1238',
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: '#EBF5FF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  sectionGroup: {
    marginBottom: 20,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1238',
    marginBottom: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contentCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1238',
    marginBottom: 3,
  },
  itemMessage: {
    fontSize: 12,
    color: '#4A5568',
    lineHeight: 18,
    marginBottom: 6,
  },
  itemTimestamp: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
});

