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
import { formatINR } from '../../utils/currency';

export default function AdminDashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, transactions, switchRole } = useApp();

  const totalVolume = transactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalExpensesLogged = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalIncomeLogged = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const mockUsers = [
    { id: '25030024', name: 'John Smith', email: 'john.smith@example.com', status: 'Active', plan: 'Premium' },
    { id: '25030025', name: 'Pooja R', email: 'pooja.r@example.com', status: 'Active', plan: 'Free' },
    { id: '25030026', name: 'Karthik S', email: 'karthik.s@example.com', status: 'Active', plan: 'Student' },
    { id: '25030027', name: 'Ananya V', email: 'ananya.v@example.com', status: 'Active', plan: 'Premium' },
  ];

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
            onPress={() => navigation.openDrawer()}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={22} color="#1E1238" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Admin Console</Text>

          <TouchableOpacity
            style={styles.navCircleBtn}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color="#1E1238" />
          </TouchableOpacity>
        </View>

        {/* Admin Badge Banner */}
        <View style={styles.adminBannerCard}>
          <View style={styles.adminBadgeRow}>
            <Ionicons name="shield-checkmark" size={18} color="#B76E00" />
            <Text style={styles.adminBadgeTitle}>Administrator Privilege Active</Text>
          </View>
          <Text style={styles.adminBannerSubtitle}>
            Full authority to view customer analytics, system balances & transaction audit logs.
          </Text>
        </View>
      </View>

      {/* Curved Sheet Content */}
      <View style={styles.sheetContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom, 20) + 90,
          }}
        >
          {/* Key System Metrics Grid */}
          <Text style={styles.sectionHeader}>System Overview</Text>

          <View style={styles.metricsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="people-outline" size={22} color="#1E40AF" />
              <Text style={styles.statBoxNumber}>1,248</Text>
              <Text style={styles.statBoxLabel}>Total Customers</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="receipt-outline" size={22} color="#2563EB" />
              <Text style={styles.statBoxNumber}>{transactions.length}</Text>
              <Text style={styles.statBoxLabel}>Active Records</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="trending-up-outline" size={22} color="#1E40AF" />
              <Text style={styles.statBoxNumber}>{formatINR(totalIncomeLogged)}</Text>
              <Text style={styles.statBoxLabel}>Total Inflows (₹)</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="cash-outline" size={22} color="#FF6B00" />
              <Text style={styles.statBoxNumber}>{formatINR(totalExpensesLogged)}</Text>
              <Text style={styles.statBoxLabel}>Total Outflows (₹)</Text>
            </View>
          </View>

          {/* Quick Role Switcher Button for Demo/Grading */}
          <TouchableOpacity
            style={styles.switchRoleBtn}
            onPress={() => {
              switchRole('Customer');
              navigation.navigate('HomeTabs', { screen: 'Home' });
            }}
          >
            <Ionicons name="swap-horizontal" size={18} color="#FFFFFF" />
            <Text style={styles.switchRoleBtnText}>
              Switch to Customer View (Test Mode)
            </Text>
          </TouchableOpacity>

          {/* Managed Customer Accounts */}
          <Text style={[styles.sectionHeader, { marginTop: 20 }]}>
            Registered Customers
          </Text>

          {mockUsers.map((u) => (
            <View key={u.id} style={styles.userCard}>
              <View style={styles.userAvatarCircle}>
                <Text style={styles.avatarInitial}>{u.name.charAt(0)}</Text>
              </View>

              <View style={styles.userCardInfo}>
                <Text style={styles.userCardName}>{u.name}</Text>
                <Text style={styles.userCardEmail}>{u.email}</Text>
                <Text style={styles.userCardId}>Account ID: {u.id}</Text>
              </View>

              <View style={styles.userCardBadge}>
                <Text style={styles.badgeText}>{u.status}</Text>
              </View>
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
    marginBottom: 14,
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
  adminBannerCard: {
    backgroundColor: '#FFECCC',
    borderRadius: 18,
    padding: 14,
  },
  adminBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  adminBadgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B76E00',
  },
  adminBannerSubtitle: {
    fontSize: 11,
    color: '#664000',
    lineHeight: 16,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: '#EBF5FF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 20,
    paddingTop: 22,
    marginTop: 14,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  statBoxNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
    marginBottom: 2,
  },
  statBoxLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF6B00',
    height: 48,
    borderRadius: 24,
    marginTop: 18,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  switchRoleBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  userAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  userCardInfo: {
    flex: 1,
  },
  userCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  userCardEmail: {
    fontSize: 11,
    color: '#64748B',
  },
  userCardId: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  userCardBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C2410C',
  },
});

