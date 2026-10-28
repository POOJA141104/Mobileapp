import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

export default function SignUpScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { signUp } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Basic Validation
  const handleSignUp = () => {
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!phone.trim() || phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    signUp({
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dob: dob.trim() || '01/01/2000',
      role,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Top Notch-Safe Emerald Header */}
          <View
            style={[
              styles.headerSection,
              {
                paddingTop: Math.max(insets.top, 24) + 16,
                paddingBottom: 28,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>
              Join Pooja to manage your finances in ₹
            </Text>
          </View>

          {/* Curved White Sheet */}
          <View
            style={[
              styles.bodySheet,
              {
                paddingBottom: Math.max(insets.bottom, 20) + 24,
              },
            ]}
          >
            {/* Account Type Selector */}
            <View style={styles.roleTabs}>
              <TouchableOpacity
                style={[styles.roleTab, role === 'Customer' && styles.roleTabActive]}
                onPress={() => setRole('Customer')}
              >
                <Text
                  style={[
                    styles.roleTabText,
                    role === 'Customer' && styles.roleTabTextActive,
                  ]}
                >
                  Customer Account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleTab, role === 'Admin' && styles.roleTabActive]}
                onPress={() => setRole('Admin')}
              >
                <Text
                  style={[
                    styles.roleTabText,
                    role === 'Admin' && styles.roleTabTextActive,
                  ]}
                >
                  Admin Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Validation Error Message */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color="#E53E3E" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputField}
                  placeholder="e.g. John Smith"
                  placeholderTextColor="#A0AEC0"
                  value={fullName}
                  onChangeText={(val) => {
                    setFullName(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputField}
                  placeholder="example@example.com"
                  placeholderTextColor="#A0AEC0"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputField}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#A0AEC0"
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Date Of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Date Of Birth</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputField}
                  placeholder="DD / MM / YYYY"
                  placeholderTextColor="#A0AEC0"
                  value={dob}
                  onChangeText={(val) => setDob(val)}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputField}
                  placeholder="At least 6 characters"
                  placeholderTextColor="#A0AEC0"
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#1E1238"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputField}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#A0AEC0"
                  value={confirmPassword}
                  onChangeText={(val) => {
                    setConfirmPassword(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            {/* Terms and Policy Notice */}
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsBold}>Terms of Use</Text> and{' '}
              <Text style={styles.termsBold}>Privacy Policy</Text>.
            </Text>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={styles.signUpBtn}
              onPress={handleSignUp}
              activeOpacity={0.8}
            >
              <Text style={styles.signUpBtnText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.footerRow}>
              <Text style={styles.footerNormal}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E40AF',
  },
  headerSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    top: 36,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  bodySheet: {
    flex: 1,
    backgroundColor: '#EBF5FF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    padding: 3,
    marginBottom: 16,
  },
  roleTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 18,
  },
  roleTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  roleTabTextActive: {
    color: '#FF6B00',
    fontWeight: '700',
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
    color: '#0F172A',
    marginBottom: 6,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  eyeIcon: {
    padding: 6,
  },
  termsText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 14,
    lineHeight: 16,
  },
  termsBold: {
    fontWeight: '700',
    color: '#1E40AF',
  },
  signUpBtn: {
    backgroundColor: '#FF6B00',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  signUpBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  footerNormal: {
    fontSize: 12,
    color: '#64748B',
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B00',
  },
});

