import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatINR } from '../utils/currency';

export default function TransactionItem({ transaction, onPress, onLongPress }) {
  const isExpense = transaction.type === 'expense';

  // Get matching icon based on category or custom icon
  const getCategoryIcon = (category = '') => {
    const cat = category.toLowerCase();
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
    return transaction.icon || 'card-outline';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(transaction)}
      onLongPress={() => onLongPress && onLongPress(transaction)}
      activeOpacity={0.7}
    >
      {/* Circular icon: Orange for expense, Royal Blue for income */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isExpense ? '#FF6B00' : '#1E40AF' },
        ]}
      >
        <Ionicons name={getCategoryIcon(transaction.category)} size={22} color="#FFFFFF" />
      </View>

      {/* Title & Date */}
      <View style={styles.mainInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.title}
        </Text>
        <Text style={styles.timeText}>
          {transaction.time} - {transaction.date || 'Recent'}
        </Text>
      </View>

      {/* Middle Tag / Category */}
      <View style={styles.tagDividerContainer}>
        <View style={styles.verticalBar} />
        <Text style={styles.tagText} numberOfLines={1}>
          {transaction.tag || transaction.category || 'General'}
        </Text>
        <View style={styles.verticalBar} />
      </View>

      {/* Amount (in Indian Rupees ₹) */}
      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amountText,
            isExpense ? styles.expenseAmount : styles.incomeAmount,
          ]}
          numberOfLines={1}
        >
          {isExpense ? `-${formatINR(transaction.amount)}` : `+${formatINR(transaction.amount)}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 10,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2EDF8',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mainInfo: {
    flex: 1.2,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1238',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  tagDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  verticalBar: {
    width: 1,
    height: 22,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
    minWidth: 46,
    textAlign: 'center',
  },
  amountContainer: {
    minWidth: 80,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '700',
  },
  incomeAmount: {
    color: '#1E40AF',
  },
  expenseAmount: {
    color: '#FF6B00',
  },
});

