import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { logout } = useApp();

  // Notification toggles
  const [generalNotif, setGeneralNotif] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibrate, setVibrate] = useState(true);
  const [txUpdate, setTxUpdate] = useState(true);
  const [expenseReminder, setExpenseReminder] = useState(true);
  const [budgetNotif, setBudgetNotif] = useState(true);
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true);

  // Modals
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Password fields
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');

  const handleChangePassword = () => {
    if (!newPass || newPass.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confPass) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    setPasswordModalVisible(false);
    Alert.alert('Success', 'Password has been updated successfully!');
    setCurrPass('');
    setNewPass('');
    setConfPass('');
  };

  const handleDeleteAccount = () => {
    setDeleteModalVisible(false);
    logout();
    Alert.alert('Account Deleted', 'Your account and personal data have been cleared.');
  };

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
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#1E1238" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Settings</Text>

          <TouchableOpacity
            style={styles.navCircleBtn}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color="#1E1238" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Curved Sheet */}
      <View style={styles.sheetContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom, 20) + 30,
          }}
        >
          {/* Quick Actions */}
          <Text style={styles.groupHeading}>General Settings</Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setPasswordModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="key-outline" size={20} color="#1E40AF" />
              <Text style={styles.actionLabel}>Password Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setDeleteModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="trash-outline" size={20} color="#E53E3E" />
              <Text style={[styles.actionLabel, { color: '#E53E3E' }]}>
                Delete Account
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
          </TouchableOpacity>

          {/* Detailed Notification Preferences */}
          <Text style={[styles.groupHeading, { marginTop: 24 }]}>
            Notification Settings
          </Text>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>General Notification</Text>
            <Switch
              value={generalNotif}
              onValueChange={setGeneralNotif}
              trackColor={{ false: '#CBD5E0', true: '#FF6B00' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Sound Alerts</Text>
            <Switch
              value={sound}
              onValueChange={setSound}
              trackColor={{ false: '#CBD5E0', true: '#FF6B00' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Vibration</Text>
            <Switch
              value={vibrate}
              onValueChange={setVibrate}
              trackColor={{ false: '#CBD5E0', true: '#FF6B00' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Transaction Updates (₹)</Text>
            <Switch
              value={txUpdate}
              onValueChange={setTxUpdate}
              trackColor={{ false: '#CBD5E0', true: '#FF6B00' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Expense Reminder</Text>
            <Switch
              value={expenseReminder}
              onValueChange={setExpenseReminder}
              trackColor={{ false: '#CBD5E0', true: '#FF6B00' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Budget Target Notifications</Text>
            <Switch
              value={budgetNotif}
              onValueChange={setBudgetNotif}
              trackColor={{ false: '#CBD5E0', true: '#FF6B00' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Low Balance Alerts</Text>
            <Switch
              value={lowBalanceAlert}
              onValueChange={setLowBalanceAlert}
              trackColor={{ false: '#CBD5E0', true: '#FF6B00' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </ScrollView>
      </View>

      {/* Password Modal */}
      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Password Settings</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <Ionicons name="close" size={22} color="#718096" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.inputField}
                placeholder="••••••••"
                secureTextEntry
                value={currPass}
                onChangeText={setCurrPass}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.inputField}
                placeholder="••••••••"
                secureTextEntry
                value={newPass}
                onChangeText={setNewPass}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.inputField}
                placeholder="••••••••"
                secureTextEntry
                value={confPass}
                onChangeText={setConfPass}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryModalBtn}
              onPress={handleChangePassword}
            >
              <Text style={styles.primaryModalBtnText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[styles.modalTitle, { color: '#E53E3E' }]}>
              Delete Account
            </Text>
            <Text style={styles.deleteWarningText}>
              Are you sure you want to delete your Pooja account? This action will permanently eliminate your balance records, transactions, and categories.
            </Text>

            <TouchableOpacity
              style={[styles.primaryModalBtn, { backgroundColor: '#E53E3E' }]}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.primaryModalBtnText}>Yes, Delete Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryModalBtn}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.secondaryModalBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: 24,
  },
  groupHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1238',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1238',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1238',
    marginBottom: 6,
  },
  deleteWarningText: {
    fontSize: 13,
    color: '#718096',
    lineHeight: 18,
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  inputField: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 44,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  primaryModalBtn: {
    backgroundColor: '#FF6B00',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryModalBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryModalBtn: {
    backgroundColor: '#DBEAFE',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryModalBtnText: {
    color: '#1E40AF',
    fontSize: 15,
    fontWeight: '700',
  },
});

