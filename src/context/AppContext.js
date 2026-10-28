import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  INITIAL_USER,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
} from '../utils/mockData';
import { formatINR } from '../utils/currency';

const AppContext = createContext();

const STORAGE_KEYS = {
  USER: '@pooja_user',
  TRANSACTIONS: '@pooja_transactions',
  CATEGORIES: '@pooja_categories',
  NOTIFICATIONS: '@pooja_notifications',
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(INITIAL_USER);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // starts at Login/Auth screen
  const [homeReportType, setHomeReportType] = useState('Monthly'); // 'Daily' | 'Weekly' | 'Monthly'

  // Personalized alert banner state
  const [activeAlert, setActiveAlert] = useState(null);

  // Load from AsyncStorage if available
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        if (savedUser) setUser(JSON.parse(savedUser));

        const savedTx = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        if (savedTx) setTransactions(JSON.parse(savedTx));

        const savedCats = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
        if (savedCats) setCategories(JSON.parse(savedCats));

        const savedNotifs = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      } catch (err) {
        console.warn('Error loading storage:', err);
      }
    };
    loadSavedData();
  }, []);

  // Save changes to AsyncStorage
  const persistData = async (key, val) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('Persist error:', e);
    }
  };

  // Helper to trigger personalized alert (Part III - Requirement ii)
  const triggerPersonalizedAlert = (title, message, type = 'success') => {
    const alertObj = {
      id: Date.now().toString(),
      title,
      message,
      type, // 'success' | 'warning' | 'info'
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setActiveAlert(alertObj);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setActiveAlert((current) => (current && current.id === alertObj.id ? null : current));
    }, 6000);
  };

  const dismissAlert = () => {
    setActiveAlert(null);
  };

  // Calculate overall financial metrics
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalBalance = totalIncome - totalExpense;

  // Add Transaction
  const addTransaction = (newTx) => {
    const createdTx = {
      id: 'tx_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      month: 'April 2024',
      ...newTx,
      amount: Number(newTx.amount),
    };

    const updatedTransactions = [createdTx, ...transactions];
    setTransactions(updatedTransactions);
    persistData(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);

    // Update Category total if expense
    if (createdTx.type === 'expense' && createdTx.category) {
      const updatedCategories = categories.map((cat) => {
        if (cat.name.toLowerCase() === createdTx.category.toLowerCase()) {
          return { ...cat, spent: cat.spent + createdTx.amount };
        }
        return cat;
      });
      setCategories(updatedCategories);
      persistData(STORAGE_KEYS.CATEGORIES, updatedCategories);
    }

    // Personalized Alert Message (Part III - ii)
    const formattedAmt = formatINR(createdTx.amount);
    let alertMsg = '';
    if (createdTx.type === 'expense') {
      alertMsg = `₹ Alert: You recorded an expense of ${formattedAmt} under ${createdTx.category}. You're on track with your monthly budget!`;
    } else {
      alertMsg = `₹ Awesome! ${formattedAmt} credited to your balance from ${createdTx.title}. Net balance updated!`;
    }

    triggerPersonalizedAlert('Transaction Saved', alertMsg, createdTx.type === 'expense' ? 'info' : 'success');

    // Add to Notification list
    const newNotif = {
      id: 'notif_' + Date.now(),
      title: 'Transactions',
      message: `A new transaction has been registered: ${createdTx.title} | ${createdTx.category} | ${createdTx.type === 'expense' ? '-' : '+'}${formattedAmt}`,
      time: `${createdTx.time} - Today`,
      category: 'Today',
      icon: createdTx.type === 'expense' ? 'trending-down-outline' : 'trending-up-outline',
      type: 'transaction',
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    persistData(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);

    return createdTx;
  };

  // Edit Transaction
  const editTransaction = (id, updatedFields) => {
    const existing = transactions.find((t) => t.id === id);
    if (!existing) return;

    const updatedTransactions = transactions.map((t) =>
      t.id === id ? { ...t, ...updatedFields, amount: Number(updatedFields.amount || t.amount) } : t
    );
    setTransactions(updatedTransactions);
    persistData(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);

    const formattedAmt = formatINR(updatedFields.amount || existing.amount);
    triggerPersonalizedAlert(
      'Transaction Updated',
      `Personalized Notice: ${existing.title} was modified to ${formattedAmt}. Your financial report has been updated.`,
      'info'
    );
  };

  // Delete Transaction
  const deleteTransaction = (id) => {
    const existing = transactions.find((t) => t.id === id);
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    persistData(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);

    if (existing) {
      triggerPersonalizedAlert(
        'Transaction Removed',
        `Personalized Alert: Transaction "${existing.title}" (${formatINR(existing.amount)}) has been removed. Balance recalculated.`,
        'warning'
      );
    }
  };

  // Authentication Handlers
  const login = (emailOrName, password, role = 'Customer') => {
    const isRoleAdmin = role === 'Admin';
    const defaultEmail = isRoleAdmin ? 'admin@poojaapp.in' : 'john.smith@example.com';
    const rawInput = (emailOrName && emailOrName.trim()) || '';

    // Calculate personalized display name from whatever the user typed
    let resolvedName = '';
    let resolvedEmail = '';

    if (rawInput) {
      if (rawInput.includes('@')) {
        resolvedEmail = rawInput;
        const prefix = rawInput.split('@')[0].replace(/[._-]/g, ' ');
        resolvedName = prefix
          .split(' ')
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
      } else {
        // User typed a custom name e.g. "Pooja", "Arun Kumar", "Admin Head"
        resolvedName = rawInput
          .split(' ')
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        resolvedEmail = `${rawInput.toLowerCase().replace(/\s+/g, '')}@poojaapp.in`;
      }
    } else {
      resolvedName = isRoleAdmin ? 'Administrator' : 'John Smith';
      resolvedEmail = defaultEmail;
    }

    const updated = {
      ...user,
      name: resolvedName,
      email: resolvedEmail,
      role: role || 'Customer',
    };

    setUser(updated);
    setIsAuthenticated(true);
    persistData(STORAGE_KEYS.USER, updated);

    // Personalized Alert Message prominently addressing the logged in user by name!
    triggerPersonalizedAlert(
      `Welcome, ${resolvedName}!`,
      `Hi ${resolvedName}, you have successfully signed in as ${updated.role}! Your personalized ₹ budget tracker is ready.`,
      'success'
    );
  };

  const signUp = (userData) => {
    const rawName = userData.name && userData.name.trim() ? userData.name.trim() : 'Customer User';
    const newUser = {
      ...user,
      ...userData,
      name: rawName,
      id: Math.floor(10000000 + Math.random() * 90000000).toString(),
      role: userData.role || 'Customer',
    };
    setUser(newUser);
    setIsAuthenticated(true);
    persistData(STORAGE_KEYS.USER, newUser);

    triggerPersonalizedAlert(
      `Welcome to Pooja, ${newUser.name}!`,
      `Account created successfully for ${newUser.name} (${newUser.role}). Start managing your finances in ₹!`,
      'success'
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (profileData) => {
    const updated = { ...user, ...profileData };
    setUser(updated);
    persistData(STORAGE_KEYS.USER, updated);
    triggerPersonalizedAlert('Profile Updated', 'Your personal account settings have been saved successfully.', 'success');
  };

  const switchRole = (newRole) => {
    const updated = { ...user, role: newRole };
    setUser(updated);
    persistData(STORAGE_KEYS.USER, updated);
    triggerPersonalizedAlert(
      'Role Switched',
      `Switched view to ${newRole} mode. All permissions and navigation updated.`,
      'info'
    );
  };

  // Dynamic reports data for Daily, Weekly, Monthly (Part III - iii)
  const getReportData = (period = homeReportType) => {
    if (period === 'Daily') {
      return {
        balance: 77830,
        income: 15000,
        expense: 2600,
        savingsRate: '35%',
        revenueLastPeriod: 15000,
        foodLastPeriod: 2600,
        label: 'Today',
        transactions: transactions.filter((t) => t.date === '2024-04-30' || t.title === 'Dinner' || t.title === 'Salary'),
      };
    } else if (period === 'Weekly') {
      return {
        balance: 145000,
        income: 40000,
        expense: 8200,
        savingsRate: '42%',
        revenueLastPeriod: 40000,
        foodLastPeriod: 3900,
        label: 'This Week',
        transactions: transactions.slice(0, 5),
      };
    } else {
      // Monthly
      return {
        balance: totalBalance > 0 ? totalBalance : 778300,
        income: totalIncome > 0 ? totalIncome : 150000,
        expense: totalExpense > 0 ? totalExpense : 36220,
        savingsRate: '30%',
        revenueLastPeriod: 150000,
        foodLastPeriod: 15450,
        label: 'This Month',
        transactions: transactions.slice(0, 6),
      };
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role: user.role,
        isAuthenticated,
        transactions,
        categories,
        notifications,
        activeAlert,
        homeReportType,
        setHomeReportType,
        totalBalance,
        totalIncome,
        totalExpense,
        login,
        signUp,
        logout,
        updateProfile,
        switchRole,
        addTransaction,
        editTransaction,
        deleteTransaction,
        triggerPersonalizedAlert,
        dismissAlert,
        getReportData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

