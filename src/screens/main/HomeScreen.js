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
import TransactionItem from '../../components/TransactionItem';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    user,
    role,
    homeReportType,
    setHomeReportType,
    getReportData,
    switchRole,
    logout,
  } = useApp();

  const report = getReportData(homeReportType);

  const handleTransactionPress = (tx) => {
    navigation.navigate('AddExpense', { transaction: tx });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 90, // safe distance above custom tab bar
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Notch-Safe Header Section */}
        <View
          style={[
            styles.headerBanner,
            {
              paddingTop: Math.max(insets.top, 24) + 10,
            },
          ]}
        >
          {/* Top Row: Drawer Menu Button, Greeting, Role Badge & Notification */}
          <View style={styles.topNavRow}>
            <TouchableOpacity
              style={styles.navCircleBtn}
              onPress={() => navigation.openDrawer()}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="menu" size={22} color="#1E1238" />
            </TouchableOpacity>

            <View style={styles.greetingContainer}>
              <Text style={styles.greetingTitle}>Hi, Welcome Back</Text>
              <Text style={styles.greetingSubtitle}>
                {user.name} ({role})
              </Text>
            </View>

            <View style={styles.topRightBtns}>
              <TouchableOpacity
                style={[
                  styles.roleSwitchBadge,
                  role === 'Admin' ? styles.adminPill : styles.customerPill,
                ]}
                onPress={() => switchRole(role === 'Admin' ? 'Customer' : 'Admin')}
                activeOpacity={0.8}
              >
                <Text style={styles.roleSwitchText}>{role}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navCircleBtn}
                onPress={() => navigation.navigate('Notifications')}
                activeOpacity={0.7}
              >
                <Ionicons name="notifications-outline" size={20} color="#1E1238" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance & Expense Overview Card (Matching Figma) */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceSplitRow}>
              {/* Total Balance */}
              <View style={styles.balanceColumn}>
                <View style={styles.metricLabelRow}>
                  <Ionicons name="arrow-up-circle-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.metricLabel}>Total Balance</Text>
                </View>
                <Text style={styles.balanceAmount} numberOfLines={1}>
                  {formatINR(report.balance)}
                </Text>
              </View>

              <View style={styles.verticalDividerWhite} />

              {/* Total Expense */}
              <View style={styles.balanceColumn}>
                <View style={styles.metricLabelRow}>
                  <Ionicons name="arrow-down-circle-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.metricLabel}>Total Expense</Text>
                </View>
                <Text style={styles.expenseAmount} numberOfLines={1}>
                  -{formatINR(report.expense)}
                </Text>
              </View>
            </View>

            {/* Target Budget Progress Bar */}
            <View style={styles.progressBarWrapper}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: report.savingsRate }]} />
              </View>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressPercent}>{report.savingsRate}</Text>
                <Text style={styles.progressLimit}>{formatINR(200000)} limit</Text>
              </View>
            </View>

            {/* Status Checklist Notice */}
            <View style={styles.statusNoticeRow}>
              <Ionicons name="checkbox-outline" size={16} color="#FFFFFF" />
              <Text style={styles.statusNoticeText}>
                {report.savingsRate} Of Your Expenses, Looks Good.
              </Text>
            </View>
          </View>
        </View>

        {/* Curved White Sheet Content */}
        <View style={styles.sheetContainer}>
          {/* Goals and Highlights Card (Emerald Rounded Box) */}
          <View style={styles.goalsCard}>
            {/* Left: Savings On Goals with circular progress & car */}
            <View style={styles.goalsLeftSection}>
              <View style={styles.goalRingContainer}>
                <View style={styles.goalRingProgress}>
                  <Ionicons name="car-outline" size={26} color="#1E1238" />
                </View>
              </View>
              <Text style={styles.goalRingLabel}>Savings On Goals</Text>
            </View>

            {/* Middle Divider */}
            <View style={styles.goalsVerticalDivider} />

            {/* Right: Revenue & Food last period stats */}
            <View style={styles.goalsRightSection}>
              <View style={styles.statMetricRow}>
                <Ionicons name="cash-outline" size={22} color="#1E1238" />
                <View style={styles.statTextCol}>
                  <Text style={styles.statSubText}>Revenue ({report.label})</Text>
                  <Text style={styles.statMainText}>
                    +{formatINR(report.revenueLastPeriod)}
                  </Text>
                </View>
              </View>

              <View style={styles.statHorizontalDivider} />

              <View style={styles.statMetricRow}>
                <Ionicons name="restaurant-outline" size={22} color="#1E1238" />
                <View style={styles.statTextCol}>
                  <Text style={styles.statSubText}>Food ({report.label})</Text>
                  <Text style={[styles.statMainText, { color: '#2979FF' }]}>
                    -{formatINR(report.foodLastPeriod)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Part III (iii): Dynamic Reports Selector (Daily / Weekly / Monthly) */}
          <View style={styles.reportSelectorSection}>
            <View style={styles.reportTabsWrapper}>
              {['Daily', 'Weekly', 'Monthly'].map((tab) => {
                const isActive = homeReportType === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.reportTabBtn, isActive && styles.reportTabBtnActive]}
                    onPress={() => setHomeReportType(tab)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.reportTabBtnText,
                        isActive && styles.reportTabBtnTextActive,
                      ]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Quick Actions Row */}
          <View style={styles.quickActionRow}>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => navigation.navigate('AddExpense')}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={18} color="#FFFFFF" />
              <Text style={styles.quickActionText}>+ Add Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionBtn, { backgroundColor: '#3B82F6' }]}
              onPress={() => navigation.navigate('Transactions')}
              activeOpacity={0.8}
            >
              <Ionicons name="receipt-outline" size={18} color="#FFFFFF" />
              <Text style={styles.quickActionText}>Month Wise View</Text>
            </TouchableOpacity>
          </View>

          {/* Section Header: Recent Transactions */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {homeReportType} Transactions
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Transactions')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Transaction List */}
          {report.transactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onPress={handleTransactionPress}
            />
          ))}

          {/* Sign In & Sign Out Options Footer (PDF Part I (1)) */}
          <View style={styles.authOptionsCard}>
            <Text style={styles.authNoticeText}>
              Logged in as <Text style={{ fontWeight: '700' }}>{user.email}</Text> ({role})
            </Text>
            <View style={styles.authBtnRow}>
              <TouchableOpacity
                style={styles.authSmallBtn}
                onPress={() => {
                  logout();
                }}
              >
                <Ionicons name="log-out-outline" size={15} color="#E53E3E" />
                <Text style={styles.authBtnTextRed}>Sign Out</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.authSmallBtn, { backgroundColor: '#FFEDD5' }]}
                onPress={() => {
                  logout();
                }}
              >
                <Ionicons name="person-add-outline" size={15} color="#FF6B00" />
                <Text style={styles.authBtnTextGreen}>Create New User</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 20,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  greetingContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1238',
  },
  greetingSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(9, 48, 48, 0.8)',
    marginTop: 2,
  },
  topRightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleSwitchBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  customerPill: {
    backgroundColor: '#FFFFFF',
  },
  adminPill: {
    backgroundColor: '#FFECCC',
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E1065',
    textTransform: 'uppercase',
  },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  balanceSplitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceColumn: {
    flex: 1,
  },
  verticalDividerWhite: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 12,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1238',
    letterSpacing: -0.3,
  },
  progressBarWrapper: {
    marginVertical: 6,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressPercent: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressLimit: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  statusNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  statusNoticeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: '#EBF5FF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  goalsCard: {
    backgroundColor: '#1E40AF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  goalsLeftSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  goalRingContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#3B82F6',
    borderRightColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  goalRingProgress: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalRingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E1238',
    textAlign: 'center',
  },
  goalsVerticalDivider: {
    width: 1,
    height: 64,
    backgroundColor: 'rgba(9, 48, 48, 0.2)',
    marginHorizontal: 12,
  },
  goalsRightSection: {
    flex: 1,
    justifyContent: 'center',
  },
  statMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statTextCol: {
    flex: 1,
  },
  statSubText: {
    fontSize: 11,
    color: 'rgba(9, 48, 48, 0.75)',
    fontWeight: '600',
  },
  statMainText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1238',
  },
  statHorizontalDivider: {
    height: 1,
    backgroundColor: 'rgba(9, 48, 48, 0.15)',
    marginVertical: 8,
  },
  reportSelectorSection: {
    marginBottom: 16,
  },
  reportTabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    borderRadius: 24,
    padding: 4,
  },
  reportTabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  reportTabBtnActive: {
    backgroundColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  reportTabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  reportTabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    borderRadius: 18,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1238',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  authOptionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  authNoticeText: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 10,
  },
  authBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  authSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFF5F5',
  },
  authBtnTextRed: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E53E3E',
  },
  authBtnTextGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B00',
  },
});

