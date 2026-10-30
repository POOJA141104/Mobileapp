import React, { useState, useMemo, useRef } from 'react';
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

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AnalysisScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, role, totalBalance, totalIncome, totalExpense, transactions = [] } = useApp();
  const scrollViewRef = useRef(null);
  const calendarSectionRef = useRef(null);

  const [activePeriod, setActivePeriod] = useState('Monthly'); // 'Daily' | 'Weekly' | 'Monthly' | 'Year'

  // Calendar State
  const [selectedDate, setSelectedDate] = useState(() => {
    if (transactions && transactions.length > 0 && transactions[0].date) {
      return transactions[0].date;
    }
    return '2024-04-24';
  });

  const [calendarMonth, setCalendarMonth] = useState(() => {
    if (transactions && transactions.length > 0 && transactions[0].date) {
      const parts = transactions[0].date.split('-').map(Number);
      return new Date(parts[0], parts[1] - 1, 1);
    }
    return new Date(2024, 3, 1); // April 2024
  });

  // Map of transactions indexed by 'YYYY-MM-DD'
  const dateTransactionsMap = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      if (!tx.date) return;
      if (!map[tx.date]) {
        map[tx.date] = { income: 0, expense: 0, list: [] };
      }
      if (tx.type === 'income') {
        map[tx.date].income += Number(tx.amount || 0);
      } else {
        map[tx.date].expense += Number(tx.amount || 0);
      }
      map[tx.date].list.push(tx);
    });
    return map;
  }, [transactions]);

  // Selected date's transactions & totals
  const selectedDayData = useMemo(() => {
    return dateTransactionsMap[selectedDate] || { income: 0, expense: 0, list: [] };
  }, [dateTransactionsMap, selectedDate]);

  // Calendar Grid Cells Computation
  const calendarGrid = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // Overflow from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNumber: d,
        isCurrentMonth: false,
        dateStr,
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNumber: d,
        isCurrentMonth: true,
        dateStr,
      });
    }

    // Overflow into next month to complete the grid (multiples of 7)
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const nextM = month === 11 ? 0 : month + 1;
        const nextY = month === 11 ? year + 1 : year;
        const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        cells.push({
          dayNumber: d,
          isCurrentMonth: false,
          dateStr,
        });
      }
    }

    return cells;
  }, [calendarMonth]);

  // Month summary for the viewed calendar month
  const viewedMonthKey = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}`;
  const viewedMonthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date && t.date.startsWith(viewedMonthKey));
  }, [transactions, viewedMonthKey]);

  const viewedMonthTotals = useMemo(() => {
    let inc = 0;
    let exp = 0;
    viewedMonthTransactions.forEach((t) => {
      if (t.type === 'income') inc += Number(t.amount || 0);
      else exp += Number(t.amount || 0);
    });
    return { income: inc, expense: exp, net: inc - exp };
  }, [viewedMonthTransactions]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };

  const handleJumpToLatest = () => {
    if (transactions && transactions.length > 0 && transactions[0].date) {
      const parts = transactions[0].date.split('-').map(Number);
      setCalendarMonth(new Date(parts[0], parts[1] - 1, 1));
      setSelectedDate(transactions[0].date);
    } else {
      const now = new Date();
      setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      setSelectedDate(todayStr);
    }
  };

  const scrollToCalendar = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 550, animated: true });
    }
  };

  const formatFriendlyDate = (dateString) => {
    if (!dateString) return '';
    try {
      const [y, m, d] = dateString.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      const monthShort = MONTH_NAMES[m - 1] || '';
      return `${weekday}, ${d} ${monthShort} ${y}`;
    } catch {
      return dateString;
    }
  };

  const getCategoryIcon = (category = '') => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('food') || cat.includes('dinner') || cat.includes('lunch') || cat.includes('pizza') || cat.includes('brunch')) {
      return 'restaurant-outline';
    }
    if (cat.includes('salary') || cat.includes('income') || cat.includes('cash')) {
      return 'cash-outline';
    }
    if (cat.includes('grocery') || cat.includes('groceries') || cat.includes('pantry')) {
      return 'bag-handle-outline';
    }
    if (cat.includes('rent')) {
      return 'key-outline';
    }
    if (cat.includes('transport') || cat.includes('fuel') || cat.includes('travel')) {
      return 'bus-outline';
    }
    if (cat.includes('medicine') || cat.includes('health')) {
      return 'medkit-outline';
    }
    if (cat.includes('gift')) {
      return 'gift-outline';
    }
    if (cat.includes('saving')) {
      return 'wallet-outline';
    }
    if (cat.includes('entertainment') || cat.includes('ticket')) {
      return 'ticket-outline';
    }
    return 'card-outline';
  };

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
        ref={scrollViewRef}
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
                <TouchableOpacity style={styles.chartIconBtn} onPress={scrollToCalendar}>
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

          {/* Financial Calendar & Detailed Daily Breakdown */}
          <View style={styles.calendarSection} ref={calendarSectionRef}>
            {/* Calendar Section Header */}
            <View style={styles.calendarSectionHeader}>
              <View style={styles.calendarTitleRow}>
                <View style={styles.calendarHeaderIconCircle}>
                  <Ionicons name="calendar" size={18} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.calendarMainTitle}>Financial Calendar</Text>
                  <Text style={styles.calendarSubTitle}>Tap any date for detailed transaction logs</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.jumpTodayBtn}
                onPress={handleJumpToLatest}
                activeOpacity={0.8}
              >
                <Ionicons name="today-outline" size={14} color="#1E40AF" />
                <Text style={styles.jumpTodayText}>Active Date</Text>
              </TouchableOpacity>
            </View>

            {/* Interactive Calendar Card */}
            <View style={styles.calendarCard}>
              {/* Month Navigation Row */}
              <View style={styles.monthNavRow}>
                <TouchableOpacity
                  style={styles.monthNavBtn}
                  onPress={handlePrevMonth}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="chevron-back" size={20} color="#1E40AF" />
                </TouchableOpacity>

                <View style={styles.currentMonthHeader}>
                  <Text style={styles.monthNameText}>
                    {MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                  </Text>
                  <View style={styles.recordsBadge}>
                    <Text style={styles.monthTransCountBadge}>
                      {viewedMonthTransactions.length} records
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.monthNavBtn}
                  onPress={handleNextMonth}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="chevron-forward" size={20} color="#1E40AF" />
                </TouchableOpacity>
              </View>

              {/* Day of Week Headers */}
              <View style={styles.daysOfWeekRow}>
                {DAYS_OF_WEEK.map((d, index) => (
                  <View key={d} style={styles.dayOfWeekCol}>
                    <Text
                      style={[
                        styles.dayOfWeekText,
                        (index === 0 || index === 6) && styles.dayOfWeekWeekend,
                      ]}
                    >
                      {d}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Grid of Dates */}
              <View style={styles.calendarGrid}>
                {calendarGrid.map((cell, idx) => {
                  const dayData = dateTransactionsMap[cell.dateStr];
                  const hasTx = !!(dayData && dayData.list.length > 0);
                  const hasIncome = !!(dayData && dayData.income > 0);
                  const hasExpense = !!(dayData && dayData.expense > 0);
                  const isSelected = cell.dateStr === selectedDate;

                  return (
                    <TouchableOpacity
                      key={`${cell.dateStr}_${idx}`}
                      style={[
                        styles.calendarDayCell,
                        !cell.isCurrentMonth && styles.calendarDayCellOtherMonth,
                        isSelected && styles.calendarDayCellSelected,
                      ]}
                      onPress={() => setSelectedDate(cell.dateStr)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          !cell.isCurrentMonth && styles.calendarDayTextOtherMonth,
                          isSelected && styles.calendarDayTextSelected,
                        ]}
                      >
                        {cell.dayNumber}
                      </Text>

                      {/* Transaction Indicator Dots */}
                      <View style={styles.indicatorDotsRow}>
                        {hasIncome && (
                          <View
                            style={[
                              styles.dotIndicator,
                              { backgroundColor: isSelected ? '#FFFFFF' : '#1E40AF' },
                            ]}
                          />
                        )}
                        {hasExpense && (
                          <View
                            style={[
                              styles.dotIndicator,
                              { backgroundColor: isSelected ? '#FFEDD5' : '#FF6B00' },
                            ]}
                          />
                        )}
                        {!hasTx && <View style={styles.dotPlaceholder} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Calendar Legend */}
              <View style={styles.calendarLegendRow}>
                <View style={styles.legendItemSmall}>
                  <View style={[styles.legendDotSmall, { backgroundColor: '#FF6B00' }]} />
                  <Text style={styles.legendLabelSmall}>Expense</Text>
                </View>
                <View style={styles.legendItemSmall}>
                  <View style={[styles.legendDotSmall, { backgroundColor: '#1E40AF' }]} />
                  <Text style={styles.legendLabelSmall}>Income</Text>
                </View>
                <View style={styles.legendItemSmall}>
                  <View
                    style={[
                      styles.legendDotSmall,
                      { backgroundColor: '#1E40AF', borderRadius: 3, width: 10, height: 10 },
                    ]}
                  />
                  <Text style={styles.legendLabelSmall}>Selected</Text>
                </View>
              </View>
            </View>

            {/* Selected Date Details Breakdown */}
            <View style={styles.selectedDateCard}>
              <View style={styles.selectedDateHeaderRow}>
                <View style={styles.selectedDateTitleCol}>
                  <Text style={styles.selectedDateLabel}>Date Breakdown</Text>
                  <Text style={styles.selectedDateFormatted}>
                    {formatFriendlyDate(selectedDate)}
                  </Text>
                </View>
                <View style={styles.txCountBadge}>
                  <Text style={styles.txCountBadgeText}>
                    {selectedDayData.list.length} {selectedDayData.list.length === 1 ? 'Record' : 'Records'}
                  </Text>
                </View>
              </View>

              {/* Day Metrics Mini Summary in Indian Rupees (₹) */}
              <View style={styles.dayMetricsRow}>
                <View style={[styles.dayMetricBox, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={[styles.dayMetricLabel, { color: '#0369A1' }]}>Day Inflow</Text>
                  <Text style={[styles.dayMetricValue, { color: '#0284C7' }]} numberOfLines={1}>
                    +{formatINR(selectedDayData.income, { fractionDigits: 0 })}
                  </Text>
                </View>

                <View style={[styles.dayMetricBox, { backgroundColor: '#FFEDD5' }]}>
                  <Text style={[styles.dayMetricLabel, { color: '#C2410C' }]}>Day Outflow</Text>
                  <Text style={[styles.dayMetricValue, { color: '#EA580C' }]} numberOfLines={1}>
                    -{formatINR(selectedDayData.expense, { fractionDigits: 0 })}
                  </Text>
                </View>

                <View style={[styles.dayMetricBox, { backgroundColor: '#F1F5F9' }]}>
                  <Text style={[styles.dayMetricLabel, { color: '#475569' }]}>Day Net</Text>
                  <Text
                    style={[
                      styles.dayMetricValue,
                      { color: selectedDayData.income >= selectedDayData.expense ? '#1E40AF' : '#E11D48' },
                    ]}
                    numberOfLines={1}
                  >
                    {formatINR(selectedDayData.income - selectedDayData.expense, { fractionDigits: 0 })}
                  </Text>
                </View>
              </View>

              {/* Day's Transactions List */}
              <View style={styles.dayTransactionsList}>
                {selectedDayData.list.length > 0 ? (
                  selectedDayData.list.map((tx) => {
                    const isExp = tx.type === 'expense';
                    return (
                      <View key={tx.id} style={styles.dayTxItem}>
                        {/* Category Icon */}
                        <View
                          style={[
                            styles.dayTxIconCircle,
                            { backgroundColor: isExp ? '#FF6B00' : '#1E40AF' },
                          ]}
                        >
                          <Ionicons
                            name={getCategoryIcon(tx.category)}
                            size={18}
                            color="#FFFFFF"
                          />
                        </View>

                        {/* Title & Category Details */}
                        <View style={styles.dayTxInfoCol}>
                          <View style={styles.dayTxTitleRow}>
                            <Text style={styles.dayTxTitle} numberOfLines={1}>
                              {tx.title}
                            </Text>
                            <View style={styles.dayTxCategoryPill}>
                              <Text style={styles.dayTxCategoryPillText}>
                                {tx.category || 'General'}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.dayTxTimeNote} numberOfLines={1}>
                            {tx.time ? `${tx.time} • ` : ''}{tx.note || 'No notes'}
                          </Text>
                        </View>

                        {/* Rupee Amount */}
                        <Text
                          style={[
                            styles.dayTxAmount,
                            { color: isExp ? '#FF6B00' : '#1E40AF' },
                          ]}
                          numberOfLines={1}
                        >
                          {isExp ? '-' : '+'}{formatINR(tx.amount)}
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.noTxContainer}>
                    <View style={styles.noTxIconCircle}>
                      <Ionicons name="calendar-outline" size={26} color="#94A3B8" />
                    </View>
                    <Text style={styles.noTxTitle}>No Activity on this Date</Text>
                    <Text style={styles.noTxSubtitle}>
                      Zero income or expense transactions recorded on {formatFriendlyDate(selectedDate)}.
                    </Text>
                    <TouchableOpacity
                      style={styles.addExpenseForDateBtn}
                      onPress={() => navigation.navigate('AddExpense')}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="add-circle" size={16} color="#FFFFFF" />
                      <Text style={styles.addExpenseForDateText}>Add Expense for this Day</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* Viewed Month Summary Card */}
            <View style={styles.monthSummaryCard}>
              <View style={styles.monthSummaryHeader}>
                <Ionicons name="stats-chart" size={16} color="#1E40AF" />
                <Text style={styles.monthSummaryTitle}>
                  {MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()} Total Summary
                </Text>
              </View>
              <View style={styles.monthSummaryRow}>
                <View style={styles.monthSummaryCol}>
                  <Text style={styles.monthSummaryColLabel}>Total Inflow</Text>
                  <Text style={[styles.monthSummaryColValue, { color: '#1E40AF' }]}>
                    +{formatINR(viewedMonthTotals.income, { fractionDigits: 0 })}
                  </Text>
                </View>
                <View style={styles.monthSummaryColDivider} />
                <View style={styles.monthSummaryCol}>
                  <Text style={styles.monthSummaryColLabel}>Total Outflow</Text>
                  <Text style={[styles.monthSummaryColValue, { color: '#FF6B00' }]}>
                    -{formatINR(viewedMonthTotals.expense, { fractionDigits: 0 })}
                  </Text>
                </View>
                <View style={styles.monthSummaryColDivider} />
                <View style={styles.monthSummaryCol}>
                  <Text style={styles.monthSummaryColLabel}>Net Savings</Text>
                  <Text
                    style={[
                      styles.monthSummaryColValue,
                      { color: viewedMonthTotals.net >= 0 ? '#10B981' : '#E11D48' },
                    ]}
                  >
                    {formatINR(viewedMonthTotals.net, { fractionDigits: 0 })}
                  </Text>
                </View>
              </View>
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

  // Financial Calendar Styles
  calendarSection: {
    marginBottom: 20,
  },
  calendarSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calendarHeaderIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  calendarMainTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  calendarSubTitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  jumpTodayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  jumpTodayText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E40AF',
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  monthNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  currentMonthHeader: {
    alignItems: 'center',
  },
  monthNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  recordsBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  monthTransCountBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C2410C',
  },
  daysOfWeekRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 6,
  },
  dayOfWeekCol: {
    flex: 1,
    alignItems: 'center',
  },
  dayOfWeekText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  dayOfWeekWeekend: {
    color: '#FF6B00',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDayCell: {
    width: '14.28%',
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginVertical: 2,
  },
  calendarDayCellOtherMonth: {
    opacity: 0.35,
  },
  calendarDayCellSelected: {
    backgroundColor: '#1E40AF',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarDayText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  calendarDayTextOtherMonth: {
    color: '#94A3B8',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  indicatorDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
    height: 5,
  },
  dotIndicator: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
  },
  dotPlaceholder: {
    height: 4.5,
  },
  calendarLegendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  legendItemSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabelSmall: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },

  // Selected Date Details Card
  selectedDateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedDateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectedDateTitleCol: {
    flex: 1,
  },
  selectedDateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectedDateFormatted: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  txCountBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  txCountBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C2410C',
  },
  dayMetricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  dayMetricBox: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: 'center',
  },
  dayMetricLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  dayMetricValue: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  dayTransactionsList: {
    gap: 8,
  },
  dayTxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dayTxIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dayTxInfoCol: {
    flex: 1,
  },
  dayTxTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayTxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  dayTxCategoryPill: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dayTxCategoryPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  dayTxTimeNote: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  dayTxAmount: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 6,
  },
  noTxContainer: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  noTxIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  noTxTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  noTxSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
    lineHeight: 16,
  },
  addExpenseForDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF6B00',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addExpenseForDateText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Viewed Month Summary Card
  monthSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  monthSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  monthSummaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },
  monthSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthSummaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  monthSummaryColDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  monthSummaryColLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  monthSummaryColValue: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
});

