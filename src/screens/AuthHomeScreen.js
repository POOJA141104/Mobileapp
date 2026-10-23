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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export const AuthHomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { login, signup } = useApp();

  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer' or 'admin'

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Validation Errors state
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSignIn = () => {
    const errs = {};
    if (!loginEmail.trim()) {
      errs.loginEmail = 'Email is required';
    } else if (!validateEmail(loginEmail)) {
      errs.loginEmail = 'Enter a valid email address';
    }

    if (!loginPassword) {
      errs.loginPassword = 'Password is required';
    } else if (loginPassword.length < 6) {
      errs.loginPassword = 'Password must be at least 6 characters';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    login(loginEmail, loginPassword, selectedRole);
    navigation.replace('MainApp');
  };

  const handleSignUp = () => {
    const errs = {};
    if (!signupName.trim()) {
      errs.signupName = 'Full name is required';
    } else if (signupName.trim().length < 3) {
      errs.signupName = 'Name must be at least 3 characters';
    }

    if (!signupEmail.trim()) {
      errs.signupEmail = 'Email is required';
    } else if (!validateEmail(signupEmail)) {
      errs.signupEmail = 'Enter a valid email address';
    }

    if (!signupPhone.trim()) {
      errs.signupPhone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(signupPhone.trim())) {
      errs.signupPhone = 'Enter a valid 10-digit mobile number';
    }

    if (!signupPassword) {
      errs.signupPassword = 'Password is required';
    } else if (signupPassword.length < 6) {
      errs.signupPassword = 'Password must be at least 6 characters';
    }

    if (signupPassword !== signupConfirmPassword) {
      errs.signupConfirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    signup(signupName, signupEmail, signupPhone, signupPassword, selectedRole);
    navigation.replace('MainApp');
  };

  const handleQuickDemoLogin = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      login('unnikrishnan.admin@rvscas.ac.in', 'admin123', 'admin');
    } else {
      login('pooja.u.rvs@student.ac.in', 'student123', 'customer');
    }
    navigation.replace('MainApp');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 20) + 10 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Banner */}
        <View style={styles.banner}>
          <View style={styles.iconCircle}>
            <Ionicons name="basket" size={40} color={colors.primary} />
          </View>
          <Text style={styles.brandTitle}>FreshMart Grocery</Text>
          <Text style={styles.brandSubtitle}>
            Organic & Daily Essentials Delivered in Minutes
          </Text>
          {/*
          <View style={styles.collegeBadge}>
            <Text style={styles.collegeText}>
              RVS CAS • MCA Batch 2025 • Model Exam
            </Text>
          </View>
          */}
        </View>

        {/* User Role Selection Pill (Admin vs Customer) */}
        <View style={styles.roleSelectorCard}>
          <Text style={styles.roleLabel}>Select User Account Type:</Text>
          <View style={styles.roleToggleRow}>
            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === 'customer' && styles.activeRoleOption,
              ]}
              onPress={() => setSelectedRole('customer')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person"
                size={18}
                color={selectedRole === 'customer' ? '#fff' : colors.textMuted}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.roleOptionText,
                  selectedRole === 'customer' && styles.activeRoleOptionText,
                ]}
              >
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === 'admin' && styles.activeAdminRoleOption,
              ]}
              onPress={() => setSelectedRole('admin')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="shield-checkmark"
                size={18}
                color={selectedRole === 'admin' ? '#fff' : colors.textMuted}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.roleOptionText,
                  selectedRole === 'admin' && styles.activeRoleOptionText,
                ]}
              >
                Admin Store
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Auth Mode Tabs (Sign In vs Sign Up) */}
        <View style={styles.authModeTabs}>
          <TouchableOpacity
            style={[styles.authTab, authMode === 'signin' && styles.activeAuthTab]}
            onPress={() => {
              setAuthMode('signin');
              setErrors({});
            }}
          >
            <Text
              style={[
                styles.authTabText,
                authMode === 'signin' && styles.activeAuthTabText,
              ]}
            >
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authTab, authMode === 'signup' && styles.activeAuthTab]}
            onPress={() => {
              setAuthMode('signup');
              setErrors({});
            }}
          >
            <Text
              style={[
                styles.authTabText,
                authMode === 'signup' && styles.activeAuthTabText,
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Forms */}
        <View style={styles.formCard}>
          {authMode === 'signin' ? (
            /* Sign In Form */
            <View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[styles.inputWrapper, errors.loginEmail && styles.inputError]}>
                  <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. user@student.ac.in"
                    placeholderTextColor={colors.textLight}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={loginEmail}
                    onChangeText={(val) => {
                      setLoginEmail(val);
                      if (errors.loginEmail) setErrors((prev) => ({ ...prev, loginEmail: null }));
                    }}
                  />
                </View>
                {errors.loginEmail && <Text style={styles.errorText}>{errors.loginEmail}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[styles.inputWrapper, errors.loginPassword && styles.inputError]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Min. 6 characters"
                    placeholderTextColor={colors.textLight}
                    secureTextEntry={!showPassword}
                    value={loginPassword}
                    onChangeText={(val) => {
                      setLoginPassword(val);
                      if (errors.loginPassword) setErrors((prev) => ({ ...prev, loginPassword: null }));
                    }}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
                {errors.loginPassword && <Text style={styles.errorText}>{errors.loginPassword}</Text>}
              </View>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  selectedRole === 'admin' && { backgroundColor: colors.adminBadge },
                ]}
                onPress={handleSignIn}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>
                  Sign In as {selectedRole === 'admin' ? 'Admin' : 'Customer'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            /* Sign Up Form */
            <View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={[styles.inputWrapper, errors.signupName && styles.inputError]}>
                  <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.textLight}
                    value={signupName}
                    onChangeText={(val) => {
                      setSignupName(val);
                      if (errors.signupName) setErrors((prev) => ({ ...prev, signupName: null }));
                    }}
                  />
                </View>
                {errors.signupName && <Text style={styles.errorText}>{errors.signupName}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[styles.inputWrapper, errors.signupEmail && styles.inputError]}>
                  <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textLight}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={signupEmail}
                    onChangeText={(val) => {
                      setSignupEmail(val);
                      if (errors.signupEmail) setErrors((prev) => ({ ...prev, signupEmail: null }));
                    }}
                  />
                </View>
                {errors.signupEmail && <Text style={styles.errorText}>{errors.signupEmail}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Phone (10 Digits)</Text>
                <View style={[styles.inputWrapper, errors.signupPhone && styles.inputError]}>
                  <Ionicons name="call-outline" size={20} color={colors.textMuted} style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 9876543210"
                    placeholderTextColor={colors.textLight}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={signupPhone}
                    onChangeText={(val) => {
                      setSignupPhone(val);
                      if (errors.signupPhone) setErrors((prev) => ({ ...prev, signupPhone: null }));
                    }}
                  />
                </View>
                {errors.signupPhone && <Text style={styles.errorText}>{errors.signupPhone}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[styles.inputWrapper, errors.signupPassword && styles.inputError]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Create a strong password (6+ chars)"
                    placeholderTextColor={colors.textLight}
                    secureTextEntry
                    value={signupPassword}
                    onChangeText={(val) => {
                      setSignupPassword(val);
                      if (errors.signupPassword) setErrors((prev) => ({ ...prev, signupPassword: null }));
                    }}
                  />
                </View>
                {errors.signupPassword && <Text style={styles.errorText}>{errors.signupPassword}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={[styles.inputWrapper, errors.signupConfirmPassword && styles.inputError]}>
                  <Ionicons name="checkmark-done-outline" size={20} color={colors.textMuted} style={styles.fieldIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Re-enter password"
                    placeholderTextColor={colors.textLight}
                    secureTextEntry
                    value={signupConfirmPassword}
                    onChangeText={(val) => {
                      setSignupConfirmPassword(val);
                      if (errors.signupConfirmPassword)
                        setErrors((prev) => ({ ...prev, signupConfirmPassword: null }));
                    }}
                  />
                </View>
                {errors.signupConfirmPassword && (
                  <Text style={styles.errorText}>{errors.signupConfirmPassword}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  selectedRole === 'admin' && { backgroundColor: colors.adminBadge },
                ]}
                onPress={handleSignUp}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>
                  Register as {selectedRole === 'admin' ? 'Admin' : 'Customer'}
                </Text>
                <Ionicons name="checkmark" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Quick 1-Click Evaluation Logins */}
          <View style={styles.demoSection}>
            <View style={styles.demoDividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.demoDividerText}>QUICK DEMO ONE-CLICK LOGIN</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={styles.demoBtnCustomer}
                onPress={() => handleQuickDemoLogin('customer')}
                activeOpacity={0.8}
              >
                <Ionicons name="cart" size={16} color={colors.primaryDark} />
                <Text style={styles.demoBtnTextCustomer}>Login as Customer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.demoBtnAdmin}
                onPress={() => handleQuickDemoLogin('admin')}
                activeOpacity={0.8}
              >
                <Ionicons name="shield" size={16} color={colors.adminBadge} />
                <Text style={styles.demoBtnTextAdmin}>Login as Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer Note */}
        {/* <Text style={styles.footerNote}>
          Department of Computer Studies • RVS College of Arts and Science
        </Text> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 36,
    paddingBottom: 40,
  },
  banner: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textDark,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  collegeBadge: {
    marginTop: 10,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  collegeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4338CA',
  },
  roleSelectorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeRoleOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activeAdminRoleOption: {
    backgroundColor: colors.adminBadge,
    borderColor: colors.adminBadge,
  },
  roleOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
  },
  activeRoleOptionText: {
    color: '#fff',
  },
  authModeTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  authTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeAuthTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  authTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  activeAuthTabText: {
    color: colors.textDark,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FEF2F2',
  },
  fieldIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textDark,
  },
  eyeIcon: {
    padding: 6,
  },
  errorText: {
    color: colors.danger,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  demoSection: {
    marginTop: 22,
  },
  demoDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  demoDividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    marginHorizontal: 8,
    letterSpacing: 0.5,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoBtnCustomer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  demoBtnTextCustomer: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  demoBtnAdmin: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.adminBadgeLight,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  demoBtnTextAdmin: {
    color: colors.adminBadge,
    fontSize: 12,
    fontWeight: '700',
  },
  footerNote: {
    marginTop: 20,
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
  },
});

