import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SecurityScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [changePinModalVisible, setChangePinModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(true);

  const handleSavePin = () => {
    if (newPin.length !== 4) {
      Alert.alert('Invalid PIN', 'Please enter a 4-digit security PIN.');
      return;
    }
    if (newPin !== confirmPin) {
      Alert.alert('PIN Mismatch', 'New PIN and Confirmation PIN must match.');
      return;
    }
    setChangePinModalVisible(false);
    Alert.alert('Success', 'Your security PIN has been updated successfully!');
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
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

          <Text style={styles.headerTitle}>Security</Text>

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
      <View style={styles.sheetContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Security Settings</Text>

          {/* Change PIN Option */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setChangePinModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="keypad-outline" size={20} color="#1E40AF" />
              <Text style={styles.optionLabel}>Change Pin</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
          </TouchableOpacity>

          {/* Fingerprint Option */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => {
              setFingerprintEnabled(!fingerprintEnabled);
              Alert.alert(
                'Biometrics',
                fingerprintEnabled
                  ? 'Fingerprint authentication disabled.'
                  : 'Fingerprint authentication enabled.'
              );
            }}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="finger-print-outline" size={20} color="#1E40AF" />
              <Text style={styles.optionLabel}>Fingerprint</Text>
            </View>
            <Text style={styles.statusBadgeText}>
              {fingerprintEnabled ? 'Enabled' : 'Disabled'}
            </Text>
          </TouchableOpacity>

          {/* Terms & Conditions */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setTermsModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="document-text-outline" size={20} color="#1E40AF" />
              <Text style={styles.optionLabel}>Terms And Conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Change PIN Modal (Matching Screenshot 093557.png) */}
      <Modal
        visible={changePinModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setChangePinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pinCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.pinCardTitle}>Change Pin</Text>
              <TouchableOpacity onPress={() => setChangePinModalVisible(false)}>
                <Ionicons name="close" size={22} color="#718096" />
              </TouchableOpacity>
            </View>

            <View style={styles.pinInputGroup}>
              <Text style={styles.pinInputLabel}>Current Pin</Text>
              <TextInput
                style={styles.pinInputField}
                placeholder="••••"
                placeholderTextColor="#A0AEC0"
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                value={currentPin}
                onChangeText={setCurrentPin}
              />
            </View>

            <View style={styles.pinInputGroup}>
              <Text style={styles.pinInputLabel}>New Pin</Text>
              <TextInput
                style={styles.pinInputField}
                placeholder="••••"
                placeholderTextColor="#A0AEC0"
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                value={newPin}
                onChangeText={setNewPin}
              />
            </View>

            <View style={styles.pinInputGroup}>
              <Text style={styles.pinInputLabel}>Confirm Pin</Text>
              <TextInput
                style={styles.pinInputField}
                placeholder="••••"
                placeholderTextColor="#A0AEC0"
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                value={confirmPin}
                onChangeText={setConfirmPin}
              />
            </View>

            <TouchableOpacity style={styles.savePinBtn} onPress={handleSavePin}>
              <Text style={styles.savePinBtnText}>Change Pin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Terms and Conditions Modal */}
      <Modal
        visible={termsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.pinCard, { maxHeight: '80%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.pinCardTitle}>Terms and Conditions</Text>
              <TouchableOpacity onPress={() => setTermsModalVisible(false)}>
                <Ionicons name="close" size={22} color="#718096" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ marginVertical: 12 }}>
              <Text style={styles.termsText}>
                Welcome to Pooja Finance Tracker. By using our services, you acknowledge that all data entered is strictly stored locally on your device for practical budget evaluation. All monetary denominations are rendered in Indian Rupees (₹). We adhere to strict user data confidentiality, privacy, and device-level encryption.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.savePinBtn}
              onPress={() => setTermsModalVisible(false)}
            >
              <Text style={styles.savePinBtnText}>Accept</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1238',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E1238',
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B00',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pinCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pinCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1238',
  },
  pinInputGroup: {
    marginBottom: 12,
  },
  pinInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  pinInputField: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 44,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 4,
    color: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  savePinBtn: {
    backgroundColor: '#FF6B00',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  savePinBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  termsText: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 20,
  },
});

