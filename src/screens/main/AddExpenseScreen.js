import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { parseINR } from '../../utils/currency';

export default function AddExpenseScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { addTransaction, editTransaction, categories } = useApp();

  const editingTx = route.params?.transaction;
  const preselectedCategory = route.params?.preselectedCategory;

  const [date, setDate] = useState(
    editingTx ? editingTx.date : new Date().toISOString().split('T')[0]
  );
  const [selectedCategory, setSelectedCategory] = useState(
    editingTx ? editingTx.category : preselectedCategory || 'Food'
  );
  const [amount, setAmount] = useState(
    editingTx ? editingTx.amount.toString() : ''
  );
  const [title, setTitle] = useState(editingTx ? editingTx.title : '');
  const [message, setMessage] = useState(editingTx ? editingTx.note || '' : '');
  const [txType, setTxType] = useState(editingTx ? editingTx.type : 'expense');
  const [errorMessage, setErrorMessage] = useState('');

  // Basic Validation
  const handleSave = () => {
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter an expense/transaction title.');
      return;
    }

    const numAmount = parseINR(amount);
    if (!numAmount || numAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than ₹0.');
      return;
    }

    if (!selectedCategory) {
      setErrorMessage('Please choose a category.');
      return;
    }

    if (editingTx) {
      editTransaction(editingTx.id, {
        title: title.trim(),
        category: selectedCategory,
        tag: selectedCategory,
        amount: numAmount,
        type: txType,
        note: message.trim(),
      });
    } else {
      addTransaction({
        title: title.trim(),
        category: selectedCategory,
        tag: selectedCategory,
        amount: numAmount,
        type: txType,
        note: message.trim(),
        date: date,
      });
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Notch-Safe Header */}
        <View
          style={[
            styles.headerBanner,
            {
              paddingTop: Math.max(insets.top, 24) + 10,
              paddingBottom: 24,
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

            <Text style={styles.headerTitle}>
              {editingTx ? 'Edit Transaction' : 'Add Expenses'}
            </Text>

            <TouchableOpacity
              style={styles.navCircleBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={20} color="#1E1238" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Curved Body Sheet */}
        <View
          style={[
            styles.sheetContainer,
            {
              paddingBottom: Math.max(insets.bottom, 20) + 20,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Transaction Type Tabs */}
            <View style={styles.typeTabsWrapper}>
              <TouchableOpacity
                style={[
                  styles.typeTab,
                  txType === 'expense' && styles.typeTabExpenseActive,
                ]}
                onPress={() => setTxType('expense')}
              >
                <Text
                  style={[
                    styles.typeTabText,
                    txType === 'expense' && styles.typeTabTextActive,
                  ]}
                >
                  Expense (-)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeTab,
                  txType === 'income' && styles.typeTabIncomeActive,
                ]}
                onPress={() => setTxType('income')}
              >
                <Text
                  style={[
                    styles.typeTabText,
                    txType === 'income' && styles.typeTabTextActive,
                  ]}
                >
                  Income (+)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color="#E53E3E" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Date Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Date</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputField}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#A0AEC0"
                />
                <Ionicons name="calendar-outline" size={20} color="#1E40AF" />
              </View>
            </View>

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryPillsRow}
              >
                {categories.map((cat) => {
                  const isSelected =
                    selectedCategory.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.catPill,
                        isSelected && styles.catPillSelected,
                      ]}
                      onPress={() => setSelectedCategory(cat.name)}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={16}
                        color={isSelected ? '#FFFFFF' : '#1E1238'}
                      />
                      <Text
                        style={[
                          styles.catPillText,
                          isSelected && styles.catPillTextSelected,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Amount Field (in Indian Rupees ₹) */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Amount in Indian Rupees (₹)</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.rupeePrefix}>₹</Text>
                <TextInput
                  style={[styles.inputField, { fontWeight: '700' }]}
                  placeholder="2,600.00"
                  placeholderTextColor="#A0AEC0"
                  value={amount}
                  onChangeText={(val) => {
                    setAmount(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Expense Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Expense Title</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputField}
                  placeholder="e.g. Dinner with family"
                  placeholderTextColor="#A0AEC0"
                  value={title}
                  onChangeText={(val) => {
                    setTitle(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                />
              </View>
            </View>

            {/* Enter Message / Note */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Enter Message / Notes</Text>
              <View style={[styles.inputWrapper, styles.multilineWrapper]}>
                <TextInput
                  style={[styles.inputField, styles.multilineField]}
                  placeholder="Add details, bill notes or remarks..."
                  placeholderTextColor="#A0AEC0"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Save Button (Matching Figma) */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>
                {editingTx ? 'Update Transaction' : 'Save'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    paddingTop: 20,
  },
  typeTabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    borderRadius: 24,
    padding: 4,
    marginBottom: 16,
  },
  typeTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  typeTabExpenseActive: {
    backgroundColor: '#FF6B00',
  },
  typeTabIncomeActive: {
    backgroundColor: '#1E40AF',
  },
  typeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  typeTabTextActive: {
    color: '#FFFFFF',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FED7D7',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#C53030',
    flex: 1,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  rupeePrefix: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E40AF',
    marginRight: 6,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  multilineWrapper: {
    height: 100,
    paddingVertical: 12,
    borderRadius: 20,
  },
  multilineField: {
    height: '100%',
  },
  categoryPillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  catPillSelected: {
    backgroundColor: '#FF6B00',
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },
  catPillTextSelected: {
    color: '#FFFFFF',
  },
  saveBtn: {
    backgroundColor: '#FF6B00',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

