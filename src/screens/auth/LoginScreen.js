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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer'); // 'Customer' | 'Admin'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectRole = (newRole) => {
    setRole(newRole);
    setErrorMessage('');
  };

  // Sign In Handler
  const handleLogin = () => {
    setErrorMessage('');
    const rawInput = email.trim();
    const finalPassword = password.trim() || 'password123';

    login(rawInput, finalPassword, role);
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
                paddingBottom: 36,
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

            <Text style={styles.headerTitle}>Welcome</Text>
            <Text style={styles.headerSubtitle}>Sign in to your Pooja account</Text>
          </View>

          {/* Curved White / Mint Body Sheet */}
          <View
            style={[
              styles.bodySheet,
              {
                paddingBottom: Math.max(insets.bottom, 20) + 24,
              },
            ]}
          >
            {/* User Role Selector (Admin vs Customer) */}
            <View style={styles.roleSelectorContainer}>
              <Text style={styles.roleLabel}>Select User Mode:</Text>
              <View style={styles.roleTabs}>
                <TouchableOpacity
                  style={[
                    styles.roleTab,
                    role === 'Customer' && styles.roleTabActive,
                  ]}
                  onPress={() => handleSelectRole('Customer')}
                >
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color={role === 'Customer' ? '#FF6B00' : '#718096'}
                  />
                  <Text
                    style={[
                      styles.roleTabText,
                      role === 'Customer' && styles.roleTabTextActive,
                    ]}
                  >
                    Customer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleTab,
                    role === 'Admin' && styles.roleTabActive,
                  ]}
                  onPress={() => handleSelectRole('Admin')}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={16}
                    color={role === 'Admin' ? '#FF6B00' : '#718096'}
                  />
                  <Text
                    style={[
                      styles.roleTabText,
                      role === 'Admin' && styles.roleTabTextActive,
                    ]}
                  >
                    Admin
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Validation Alert */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color="#E53E3E" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Username / Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Username Or Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputField}
                  placeholder={
                    role === 'Admin'
                      ? 'Admin name or email (e.g. Admin Pooja)'
                      : 'Customer name or email (e.g. Pooja)'
                  }
                  placeholderTextColor="#A0AEC0"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputField}
                  placeholder="Enter your password"
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

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() =>
                Alert.alert(
                  'Password Reset',
                  'A password reset code has been sent to your registered email/phone.'
                )
              }
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Log In Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Log In as {role}</Text>
            </TouchableOpacity>

            {/* Sign Up Navigation Button */}
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.8}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Bottom Link */}
            <View style={styles.footerRow}>
              <Text style={styles.footerNormal}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.footerLink}>Sign Up</Text>
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
  roleSelectorContainer: {
    marginBottom: 12,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 6,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    padding: 3,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 18,
    gap: 6,
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
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    justifyContent: 'center',
  },
  demoChip: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  demoChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E40AF',
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
  forgotBtn: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  forgotText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#FF6B00',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  signUpButton: {
    backgroundColor: '#DBEAFE',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  signUpButtonText: {
    color: '#1E40AF',
    fontSize: 15,
    fontWeight: '700',
  },
  fingerprintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  fingerprintText: {
    fontSize: 13,
    color: '#1E1238',
    fontWeight: '500',
  },
  highlightText: {
    color: '#FF6B00',
    fontWeight: '700',
  },
  socialSection: {
    alignItems: 'center',
    marginBottom: 14,
  },
  socialText: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
  },
  socialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerNormal: {
    fontSize: 12,
    color: '#718096',
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B00',
  },
});

