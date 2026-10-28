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

export default function CategoriesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { categories, totalBalance, totalExpense } = useApp();

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryDetails', { category });
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

            <Text style={styles.headerTitle}>Categories</Text>

            <TouchableOpacity
              style={styles.navCircleBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={20} color="#1E1238" />
            </TouchableOpacity>
          </View>

          {/* Balance & Expense Overview Card (Matching Figma) */}
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
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressPercent}>30%</Text>
                <Text style={styles.progressLimit}>{formatINR(200000)} limit</Text>
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

        {/* Curved Body Sheet: 3x3 Category Grid */}
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>All Expense Categories</Text>
          <Text style={styles.sheetSubtitle}>
            Select a category to view detailed transactions in Indian Rupees (₹)
          </Text>

          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(cat)}
                activeOpacity={0.7}
              >
                {/* Rounded Blue Icon Box */}
                <View style={styles.iconBox}>
                  <Ionicons name={cat.icon} size={30} color="#FFFFFF" />
                </View>

                {/* Category Name */}
                <Text style={styles.categoryName} numberOfLines={1}>
                  {cat.name}
                </Text>

                {/* Spent Amount */}
                <Text style={styles.categorySpent}>
                  {formatINR(cat.spent, { fractionDigits: 0 })}
                </Text>
              </TouchableOpacity>
            ))}
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
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1238',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 18,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#60A5FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E1238',
    marginBottom: 2,
    textAlign: 'center',
  },
  categorySpent: {
    fontSize: 11,
    fontWeight: '600',
    color: '#718096',
  },
});

