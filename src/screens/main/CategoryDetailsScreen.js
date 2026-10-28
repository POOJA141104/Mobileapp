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

export default function CategoryDetailsScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { transactions, totalBalance, totalExpense } = useApp();

  const category = route.params?.category || { name: 'Food', id: 'cat_1' };

  // Filter transactions for this specific category
  const categoryTransactions = transactions.filter(
    (t) =>
      t.category.toLowerCase() === category.name.toLowerCase() ||
      (t.tag && t.tag.toLowerCase() === category.name.toLowerCase())
  );

  // Group by month
  const groupedByMonth = categoryTransactions.reduce((acc, curr) => {
    const monthKey = curr.month || 'April 2024';
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(curr);
    return acc;
  }, {});

  const monthKeys = Object.keys(groupedByMonth);

  const handleAddExpenses = () => {
    navigation.navigate('AddExpense', { preselectedCategory: category.name });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 90,
        }}
        showsVerticalScrollIndicator={false}
      >
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

            <Text style={styles.headerTitle}>{category.name}</Text>

            <TouchableOpacity
              style={styles.navCircleBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={20} color="#1E1238" />
            </TouchableOpacity>
          </View>

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
          {categoryTransactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="fast-food-outline" size={48} color="#A0AEC0" />
              <Text style={styles.emptyText}>
                No expenses logged under {category.name} yet.
              </Text>
            </View>
          ) : (
            monthKeys.map((month) => (
              <View key={month} style={styles.monthGroup}>
                <View style={styles.monthHeaderRow}>
                  <Text style={styles.monthTitle}>{month}</Text>
                  <View style={styles.calendarIconCircle}>
                    <Ionicons name="calendar-outline" size={16} color="#1E40AF" />
                  </View>
                </View>

                {groupedByMonth[month].map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    onPress={(item) =>
                      navigation.navigate('AddExpense', { transaction: item })
                    }
                  />
                ))}
              </View>
            ))
          )}

          {/* Add Expenses Button (Matching Figma) */}
          <TouchableOpacity
            style={styles.addExpensesBtn}
            onPress={handleAddExpenses}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            <Text style={styles.addExpensesBtnText}>Add Expenses</Text>
          </TouchableOpacity>
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
    paddingTop: 22,
    marginTop: 14,
  },
  monthGroup: {
    marginBottom: 16,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1238',
  },
  calendarIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
    marginTop: 8,
  },
  addExpensesBtn: {
    backgroundColor: '#FF6B00',
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  addExpensesBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

