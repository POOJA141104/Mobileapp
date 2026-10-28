import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/currency';
import TransactionItem from '../../components/TransactionItem';

export default function TransactionsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { transactions, totalBalance, totalIncome, totalExpense, deleteTransaction } = useApp();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'income' | 'expense'

  // Filter transactions
  const filteredList = transactions.filter((t) => {
    if (activeFilter === 'income') return t.type === 'income';
    if (activeFilter === 'expense') return t.type === 'expense';
    return true;
  });

  // Group transactions by month
  const groupedByMonth = filteredList.reduce((acc, curr) => {
    const monthKey = curr.month || 'Other';
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(curr);
    return acc;
  }, {});

  const monthKeys = Object.keys(groupedByMonth);

  const handleTransactionPress = (tx) => {
    navigation.navigate('AddExpense', { transaction: tx });
  };

  const handleTransactionLongPress = (tx) => {
    Alert.alert(
      'Transaction Actions',
      `Manage "${tx.title}" (${formatINR(tx.amount)})`,
      [
        {
          text: 'Edit',
          onPress: () => navigation.navigate('AddExpense', { transaction: tx }),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(tx.id),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
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
              onPress={() => navigation.openDrawer()}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={22} color="#1E1238" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Transaction</Text>

            <TouchableOpacity
              style={styles.navCircleBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={20} color="#1E1238" />
            </TouchableOpacity>
          </View>

          {/* White Total Balance Card (Matching Figma) */}
          <View style={styles.totalBalanceCard}>
            <Text style={styles.totalBalanceLabel}>Total Balance</Text>
            <Text style={styles.totalBalanceAmount}>
              {formatINR(totalBalance > 0 ? totalBalance : 778300)}
            </Text>
          </View>

          {/* Income & Expense Toggle Selectors */}
          <View style={styles.filterCardsRow}>
            {/* Income Filter Button */}
            <TouchableOpacity
              style={[
                styles.filterPillCard,
                activeFilter === 'income' && styles.filterPillCardActive,
              ]}
              onPress={() =>
                setActiveFilter(activeFilter === 'income' ? 'all' : 'income')
              }
              activeOpacity={0.8}
            >
              <View style={styles.pillHeader}>
                <Ionicons
                  name="arrow-up-circle-outline"
                  size={18}
                  color={activeFilter === 'income' ? '#FFFFFF' : '#1E40AF'}
                />
                <Text
                  style={[
                    styles.pillTitle,
                    activeFilter === 'income' && styles.pillTitleActive,
                  ]}
                >
                  Income
                </Text>
              </View>
              <Text
                style={[
                  styles.pillAmount,
                  activeFilter === 'income' && styles.pillAmountActive,
                ]}
                numberOfLines={1}
              >
                +{formatINR(totalIncome > 0 ? totalIncome : 150000)}
              </Text>
            </TouchableOpacity>

            {/* Expense Filter Button */}
            <TouchableOpacity
              style={[
                styles.filterPillCard,
                activeFilter === 'expense' && styles.filterPillCardActiveBlue,
              ]}
              onPress={() =>
                setActiveFilter(activeFilter === 'expense' ? 'all' : 'expense')
              }
              activeOpacity={0.8}
            >
              <View style={styles.pillHeader}>
                <Ionicons
                  name="arrow-down-circle-outline"
                  size={18}
                  color={activeFilter === 'expense' ? '#FFFFFF' : '#2979FF'}
                />
                <Text
                  style={[
                    styles.pillTitle,
                    activeFilter === 'expense' && styles.pillTitleActive,
                  ]}
                >
                  Expense
                </Text>
              </View>
              <Text
                style={[
                  styles.pillAmount,
                  styles.expenseColor,
                  activeFilter === 'expense' && styles.pillAmountActive,
                ]}
                numberOfLines={1}
              >
                -{formatINR(totalExpense > 0 ? totalExpense : 36220)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Curved Body Sheet: Month-wise Groups */}
        <View style={styles.sheetContainer}>
          {/* Quick Header Bar */}
          <View style={styles.actionHeaderRow}>
            <Text style={styles.filterStatusText}>
              Showing {activeFilter.toUpperCase()} Transactions ({filteredList.length})
            </Text>

            <TouchableOpacity
              style={styles.addBtnSmall}
              onPress={() => navigation.navigate('AddExpense')}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.addBtnSmallText}>New</Text>
            </TouchableOpacity>
          </View>

          {/* Render Groups by Month */}
          {monthKeys.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="wallet-outline" size={48} color="#A0AEC0" />
              <Text style={styles.emptyText}>No transactions found.</Text>
            </View>
          ) : (
            monthKeys.map((month) => (
              <View key={month} style={styles.monthGroup}>
                {/* Month Heading with Calendar Icon */}
                <View style={styles.monthHeaderRow}>
                  <Text style={styles.monthTitle}>{month}</Text>
                  <View style={styles.calendarIconCircle}>
                    <Ionicons name="calendar-outline" size={16} color="#1E40AF" />
                  </View>
                </View>

                {/* List of items in this month */}
                {groupedByMonth[month].map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    onPress={handleTransactionPress}
                    onLongPress={handleTransactionLongPress}
                  />
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Add Transaction Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            bottom: Math.max(insets.bottom, 20) + 75,
          },
        ]}
        onPress={() => navigation.navigate('AddExpense')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
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
  totalBalanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  totalBalanceLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
    marginBottom: 2,
  },
  totalBalanceAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1238',
  },
  filterCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterPillCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  filterPillCardActive: {
    backgroundColor: '#1E40AF',
  },
  filterPillCardActiveBlue: {
    backgroundColor: '#FF6B00',
  },
  pillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pillTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E1238',
  },
  pillTitleActive: {
    color: '#FFFFFF',
  },
  pillAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E40AF',
  },
  expenseColor: {
    color: '#FF6B00',
  },
  pillAmountActive: {
    color: '#FFFFFF',
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: '#EBF5FF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 14,
  },
  actionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  addBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF6B00',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  addBtnSmallText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
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
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 10,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});

