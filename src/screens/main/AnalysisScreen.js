import React, { useState } from 'react';
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
import { TARGETS_DATA } from '../../utils/mockData';

export default function AnalysisScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, role, totalBalance, totalIncome, totalExpense } = useApp();

  const [activePeriod, setActivePeriod] = useState('Monthly'); // 'Daily' | 'Weekly' | 'Monthly' | 'Year'

  // Chart data according to timeframe
  const chartDatasets = {
    Daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      income: [3000, 4500, 2000, 5000, 9500, 1500, 2500],
      expense: [1200, 800, 2500, 1900, 4000, 2100, 1800],
      totalIncome: 28000,
      totalExpense: 14300,
    },
    Weekly: {
      labels: ['1st Week', '2nd Week', '3rd Week', '4th Week'],
      income: [25000, 15000, 18000, 42000],
      expense: [12000, 8500, 11000, 15500],
      totalIncome: 100000,
      totalExpense: 47000,
    },
    Monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      income: [120000, 140000, 150000, 150000, 130000, 160000],
      expense: [45000, 52000, 48000, 36220, 42000, 39000],
      totalIncome: 900000,
      totalExpense: 262220,
    },
    Year: {
      labels: ['2021', '2022', '2023', '2024', '2025'],
      income: [800000, 1100000, 1450000, 1800000, 2200000],
      expense: [400000, 550000, 720000, 890000, 1050000],
      totalIncome: 7350000,
      totalExpense: 3610000,
    },
  };

  const currentData = chartDatasets[activePeriod];
  const maxBarValue = Math.max(...currentData.income, ...currentData.expense);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 90,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Notch-Safe Header Banner */}
        <View
          style={[
            styles.headerBanner,
            {
              paddingTop: Math.max(insets.top, 24) + 10,
            },
          ]}
        >
          {/* Header Row */}
          <View style={styles.topNavRow}>
            <TouchableOpacity
              style={styles.navCircleBtn}
              onPress={() => navigation.openDrawer()}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={22} color="#1E1238" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Analysis</Text>

            <TouchableOpacity
              style={styles.navCircleBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={20} color="#1E1238" />
            </TouchableOpacity>
          </View>

          {/* Admin Analytical View Banner if Admin */}
          {role === 'Admin' ? (
            <View style={styles.adminBanner}>
              <View style={styles.adminBadgeRow}>
                <Ionicons name="shield-checkmark" size={16} color="#B76E00" />
                <Text style={styles.adminBadgeText}>Admin System Analytics</Text>
              </View>
              <Text style={styles.adminBannerDesc}>
                Consolidated multi-user financial volume & customer health indices
              </Text>
            </View>
          ) : null}

          {/* Balance & Expense Banner Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceSplitRow}>
              <View style={styles.balanceColumn}>
                <View style={styles.metricLabelRow}>
                  <Ionicons name="arrow-up-circle-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.metricLabel}>Total Balance</Text>
                </View>
                <Text style={styles.balanceAmount} numberOfLines={1}>
                  {formatINR(totalBalance > 0 ? totalBalance : 778300)}
                </Text>
              </View>

              <View style={styles.verticalDividerWhite} />

              <View style={styles.balanceColumn}>
                <View style={styles.metricLabelRow}>
                  <Ionicons name="arrow-down-circle-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.metricLabel}>Total Expense</Text>
                </View>
                <Text style={styles.expenseAmount} numberOfLines={1}>
                  -{formatINR(totalExpense > 0 ? totalExpense : 36220)}
                </Text>
              </View>
            </View>

            {/* Target Budget Bar */}
            <View style={styles.progressBarWrapper}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '30%' }]} />
              </View>
            </View>
            <View style={styles.statusNoticeRow}>
              <Ionicons name="checkbox-outline" size={16} color="#FFFFFF" />
              <Text style={styles.statusNoticeText}>
                30% Of Your Expenses, Looks Good.
              </Text>
            </View>
          </View>
        </View>

        {/* Curved Body Sheet */}
        <View style={styles.sheetContainer}>
          {/* Period Filter Tabs (Daily, Weekly, Monthly, Year) */}
          <View style={styles.periodTabsWrapper}>
            {['Daily', 'Weekly', 'Monthly', 'Year'].map((tab) => {
              const isActive = activePeriod === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.periodTabBtn, isActive && styles.periodTabBtnActive]}
                  onPress={() => setActivePeriod(tab)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.periodTabText,
                      isActive && styles.periodTabTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Income & Expenses Chart Card */}
          <View style={styles.chartCard}>
            {/* Chart Title and Header Icons */}
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Income & Expenses</Text>
              <View style={styles.chartIconsRow}>
                <TouchableOpacity style={styles.chartIconBtn}>
                  <Ionicons name="search-outline" size={18} color="#1E40AF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.chartIconBtn}>
                  <Ionicons name="calendar-outline" size={18} color="#1E40AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Chart Grid Lines & Bars */}
            <View style={styles.chartPlotArea}>
              {/* Background Horizontal Grid Lines */}
              <View style={styles.gridLineRow}>
                <Text style={styles.gridLabel}>15k</Text>
                <View style={styles.dottedLine} />
              </View>
              <View style={styles.gridLineRow}>
                <Text style={styles.gridLabel}>10k</Text>
                <View style={styles.dottedLine} />
              </View>
              <View style={styles.gridLineRow}>
                <Text style={styles.gridLabel}>5k</Text>
                <View style={styles.dottedLine} />
              </View>
              <View style={styles.gridLineRow}>
                <Text style={styles.gridLabel}>1k</Text>
                <View style={styles.solidBaseLine} />
              </View>

              {/* Dynamic Bar Columns */}
              <View style={styles.barsContainer}>
                {currentData.labels.map((lbl, idx) => {
                  const incHeight = (currentData.income[idx] / maxBarValue) * 110;
                  const expHeight = (currentData.expense[idx] / maxBarValue) * 110;

                  return (
                    <View key={lbl} style={styles.barGroup}>
                      <View style={styles.barsPair}>
                        {/* Income Bar (Royal Blue) */}
                        <View
                          style={[
                            styles.incomeBar,
                            { height: Math.max(incHeight, 14) },
                          ]}
                        />
                        {/* Expense Bar (Energetic Orange) */}
                        <View
                          style={[
                            styles.expenseBar,
                            { height: Math.max(expHeight, 12) },
                          ]}
                        />
                      </View>
                      <Text style={styles.barLabel}>{lbl}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#1E40AF' }]} />
                <Text style={styles.legendText}>Income</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF6B00' }]} />
                <Text style={styles.legendText}>Expenses</Text>
              </View>
            </View>
          </View>

          {/* Income & Expense Summary Cards in Indian Rupees (₹) */}
          <View style={styles.metricsSummaryRow}>
            {/* Income Card */}
            <View style={styles.metricCard}>
              <View style={styles.metricCardHeader}>
                <Ionicons name="arrow-up-circle-outline" size={22} color="#1E40AF" />
                <Text style={styles.metricCardTitle}>Income</Text>
              </View>
              <Text style={styles.metricCardAmount} numberOfLines={1}>
                {formatINR(currentData.totalIncome)}
              </Text>
            </View>

            {/* Expense Card */}
            <View style={styles.metricCard}>
              <View style={styles.metricCardHeader}>
                <Ionicons name="arrow-down-circle-outline" size={22} color="#2979FF" />
                <Text style={styles.metricCardTitle}>Expense</Text>
              </View>
              <Text
                style={[styles.metricCardAmount, { color: '#2979FF' }]}
                numberOfLines={1}
              >
                {formatINR(currentData.totalExpense)}
              </Text>
            </View>
          </View>

          {/* "My Targets" Section with Visual Rings (From Figma Screenshot) */}
          <View style={styles.targetsSection}>
            <Text style={styles.sectionHeading}>My Targets</Text>
            <View style={styles.targetsRow}>
              {TARGETS_DATA.map((target) => (
                <View key={target.id} style={styles.targetCard}>
                  {/* Circular progress badge */}
                  <View style={styles.targetCircle}>
                    <Text style={styles.targetPercent}>{target.percentage}%</Text>
                  </View>
                  <Text style={styles.targetTitle}>{target.title}</Text>
                  <Text style={styles.targetSubAmount}>
                    {formatINR(target.current, { fractionDigits: 0 })} /{' '}
                    {formatINR(target.target, { fractionDigits: 0 })}
                  </Text>
                </View>
              ))}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1238',
  },
  adminBanner: {
    backgroundColor: '#FFECCC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  adminBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B76E00',
  },
  adminBannerDesc: {
    fontSize: 11,
    color: '#664000',
    lineHeight: 15,
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
    marginBottom: 10,
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
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1238',
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
  statusNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
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
  periodTabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    borderRadius: 24,
    padding: 4,
    marginBottom: 16,
  },
  periodTabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  periodTabBtnActive: {
    backgroundColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  periodTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  periodTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1238',
  },
  chartIconsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chartIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlotArea: {
    height: 150,
    justifyContent: 'flex-end',
    position: 'relative',
    marginBottom: 10,
  },
  gridLineRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridLabel: {
    width: 24,
    fontSize: 10,
    color: '#718096',
    fontWeight: '600',
  },
  dottedLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#CBD5E0',
    opacity: 0.6,
  },
  solidBaseLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#1E1238',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingLeft: 24,
    height: 130,
  },
  barGroup: {
    alignItems: 'center',
  },
  barsPair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  incomeBar: {
    width: 6,
    backgroundColor: '#1E40AF',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  expenseBar: {
    width: 6,
    backgroundColor: '#FF6B00',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  barLabel: {
    fontSize: 10,
    color: '#718096',
    fontWeight: '600',
    marginTop: 6,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#4A5568',
    fontWeight: '600',
  },
  metricsSummaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  metricCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  metricCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
  },
  metricCardAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E40AF',
  },
  targetsSection: {
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1238',
    marginBottom: 12,
  },
  targetsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  targetCard: {
    flex: 1,
    backgroundColor: '#60A5FA',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
  },
  targetCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  targetPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  targetTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  targetSubAmount: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    textAlign: 'center',
  },
});

