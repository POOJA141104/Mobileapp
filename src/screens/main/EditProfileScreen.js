import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useApp();

  const [username, setUsername] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [pushNotifications, setPushNotifications] = useState(user.pushNotifications);
  const [darkTheme, setDarkTheme] = useState(user.darkTheme);
  const [errorMessage, setErrorMessage] = useState('');

  // Basic Validation
  const handleUpdate = () => {
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Username cannot be empty.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!phone.trim() || phone.length < 8) {
      setErrorMessage('Please provide a valid contact phone number.');
      return;
    }

    updateProfile({
      name: username.trim(),
      phone: phone.trim(),
      email: email.trim(),
      pushNotifications,
      darkTheme,
    });

    Alert.alert(
      'Profile Updated',
      'Your profile information has been saved successfully in Pooja.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Notch-Safe Header */}
        <View
          style={[
            styles.headerBanner,
            {
              paddingTop: Math.max(insets.top, 24) + 10,
              paddingBottom: 55,
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

            <Text style={styles.headerTitle}>Edit My Profile</Text>

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
          {/* Overlapping Avatar with User's Initial Letter */}
          <View style={styles.avatarWrapper}>
            <View style={styles.initialAvatarCircle}>
              <Text style={styles.initialAvatarText}>
                {username ? username.trim().charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.cameraBadge}
              onPress={() => Alert.alert('Avatar Initial', `Displaying initials for ${username || user.name}`)}
            >
              <Ionicons name="sparkles" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* User Name and ID */}
          <View style={styles.userInfoBlock}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userId}>ID: {user.id}</Text>
          </View>

          {/* Account Settings Header */}
          <Text style={styles.sectionHeader}>Account Settings</Text>

          {/* Validation Alert */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#E53E3E" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Username Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Username</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputField}
                value={username}
                onChangeText={(val) => {
                  setUsername(val);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="John Smith"
                placeholderTextColor="#A0AEC0"
              />
            </View>
          </View>

          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Phone</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputField}
                value={phone}
                onChangeText={(val) => {
                  setPhone(val);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="+91 98765 43210"
                placeholderTextColor="#A0AEC0"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Email Address Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputField}
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="example@example.com"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Switch Toggles: Push Notifications & Dark Theme */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#CBD5E0', true: '#FF6B00' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Turn Dark Theme</Text>
            <Switch
              value={darkTheme}
              onValueChange={setDarkTheme}
              trackColor={{ false: '#CBD5E0', true: '#FF6B00' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Update Profile Button */}
          <TouchableOpacity
            style={styles.updateBtn}
            onPress={handleUpdate}
            activeOpacity={0.8}
          >
            <Text style={styles.updateBtnText}>Update Profile</Text>
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
    position: 'relative',
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
    paddingHorizontal: 24,
    paddingTop: 10,
    minHeight: 550,
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginTop: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#EBF5FF',
    position: 'relative',
    backgroundColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  initialAvatarCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialAvatarText: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfoBlock: {
    alignItems: 'center',
    marginVertical: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1238',
  },
  userId: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1238',
    marginBottom: 14,
    marginTop: 6,
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
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E1238',
    marginBottom: 6,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  inputField: {
    fontSize: 14,
    color: '#0F172A',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  updateBtn: {
    backgroundColor: '#FF6B00',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  updateBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

