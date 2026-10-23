import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';

const LOGO_OPTIONS = [
  { id: 'basket', name: 'Basket' },
  { id: 'leaf', name: 'Organic' },
  { id: 'bag-handle', name: 'Bag' },
  { id: 'storefront', name: 'Shop' },
  { id: 'nutrition', name: 'Nutrition' },
];

export const ProfileScreen = ({ navigation }) => {
  const {
    currentUser,
    userRole,
    updateUserProfile,
    logout,
    orders,
    favoriteIds,
    cart,
  } = useApp();

  // Edit Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editAddress, setEditAddress] = useState(currentUser.address);
  const [editAvatarLogo, setEditAvatarLogo] = useState(
    currentUser.avatarLogo || 'basket'
  );
  const [errors, setErrors] = useState({});

  // App Settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);

  // Orders section expand
  const [showOrders, setShowOrders] = useState(false);

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const openEditModal = () => {
    setEditName(currentUser.name);
    setEditEmail(currentUser.email);
    setEditPhone(currentUser.phone);
    setEditAddress(currentUser.address);
    setEditAvatarLogo(currentUser.avatarLogo || 'basket');
    setErrors({});
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    const errs = {};
    if (!editName.trim() || editName.trim().length < 3) {
      errs.name = 'Full Name must be at least 3 characters';
    }

    const emailRe = /\S+@\S+\.\S+/;
    if (!editEmail.trim() || !emailRe.test(editEmail)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!editPhone.trim() || !/^\d{10}$/.test(editPhone.trim())) {
      errs.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!editAddress.trim()) {
      errs.address = 'Delivery address cannot be empty';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    updateUserProfile({
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      address: editAddress.trim(),
      avatarLogo: editAvatarLogo,
    });

    setIsEditModalVisible(false);
  };

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title={userRole === 'admin' ? 'Admin Profile' : 'Customer Profile'}
        subtitle={
          userRole === 'admin'
            ? 'Store Administration & Inventory Control'
            : 'Manage your personal details'
        }
        showDrawer={true}
        showCart={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.logoAvatarWrapper,
                userRole === 'admin' && {
                  backgroundColor: colors.adminBadgeLight,
                  borderColor: '#DDD6FE',
                },
              ]}
            >
              <View
                style={[
                  styles.logoAvatarInner,
                  userRole === 'admin' && { borderColor: '#C4B5FD' },
                ]}
              >
                <Ionicons
                  name={
                    userRole === 'admin'
                      ? 'shield-checkmark'
                      : currentUser.avatarLogo || 'basket'
                  }
                  size={46}
                  color={userRole === 'admin' ? colors.adminBadge : colors.primaryDark}
                />
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.avatarEditBtn,
                userRole === 'admin' && { backgroundColor: colors.adminBadge },
              ]}
              onPress={openEditModal}
            >
              <Ionicons name="pencil" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>
            {userRole === 'admin' ? 'Unnikrishnan' : currentUser.name}
          </Text>
          <Text style={styles.userEmail}>{currentUser.email}</Text>
          <Text style={styles.userPhone}>📱 +91 {currentUser.phone}</Text>

          <View style={styles.roleBadgeContainer}>
            <View
              style={[
                styles.customerRoleBadge,
                userRole === 'admin' && {
                  backgroundColor: colors.adminBadgeLight,
                },
              ]}
            >
              <Ionicons
                name={userRole === 'admin' ? 'shield-checkmark' : 'checkmark-circle'}
                size={14}
                color={userRole === 'admin' ? colors.adminBadge : colors.primaryDark}
              />
              <Text
                style={[
                  styles.customerRoleText,
                  userRole === 'admin' && { color: colors.adminBadge },
                ]}
              >
                {userRole === 'admin' ? 'VERIFIED ADMIN' : 'VERIFIED CUSTOMER'}
              </Text>
            </View>
            <Text style={styles.memberSince}>
              {userRole === 'admin'
                ? 'Store Administrator since 2024'
                : `Member since ${currentUser.memberSince || '2025'}`}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.editProfileBtn,
              userRole === 'admin' && { backgroundColor: colors.adminBadgeLight },
            ]}
            onPress={openEditModal}
            activeOpacity={0.8}
          >
            <Ionicons
              name="create-outline"
              size={16}
              color={userRole === 'admin' ? colors.adminBadge : colors.primaryDark}
            />
            <Text
              style={[
                styles.editProfileText,
                userRole === 'admin' && { color: colors.adminBadge },
              ]}
            >
              {userRole === 'admin' ? 'Edit Admin Details' : 'Edit Profile Details'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => setShowOrders(!showOrders)}
          >
            <View style={[styles.statIconCircle, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="cube-outline" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate('Favorites')}
          >
            <View style={[styles.statIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="heart-outline" size={20} color={colors.danger} />
            </View>
            <Text style={styles.statValue}>{favoriteIds.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => navigation.navigate('Cart')}
          >
            <View style={[styles.statIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="cart-outline" size={20} color={colors.primaryDark} />
            </View>
            <Text style={styles.statValue}>{totalCartCount}</Text>
            <Text style={styles.statLabel}>In Cart</Text>
          </TouchableOpacity>
        </View>

        {/* Address Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Default Delivery Address</Text>
            </View>
            <TouchableOpacity onPress={openEditModal}>
              <Text style={styles.sectionActionText}>Change</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressText}>{currentUser.address}</Text>
        </View>

        {/* Orders Accordion / History */}
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowOrders(!showOrders)}
            activeOpacity={0.7}
          >
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="receipt-outline" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Recent Grocery Orders ({orders.length})</Text>
            </View>
            <Ionicons
              name={showOrders ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          {showOrders && (
            <View style={styles.ordersList}>
              {orders.map((order) => (
                <View key={order.id} style={styles.orderItem}>
                  <View style={styles.orderTopRow}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{order.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.orderDate}>Ordered on: {order.date}</Text>
                  <Text style={styles.orderItemsPreview} numberOfLines={1}>
                    {order.items?.join(', ')}
                  </Text>
                  <View style={styles.orderBottomRow}>
                    <Text style={styles.orderTotal}>Total: ₹{order.total}</Text>
                    <Text style={styles.orderCount}>{order.itemsCount} Items</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* App Preferences */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Preferences & Alerts</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Delivery Push Notifications</Text>
              <Text style={styles.settingDesc}>Get live updates about order status</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Special Discounts & Coupons</Text>
              <Text style={styles.settingDesc}>Exclusive student offers & seasonal sales</Text>
            </View>
            <Switch
              value={orderUpdates}
              onValueChange={setOrderUpdates}
              trackColor={{ false: '#D1D5DB', true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Sign Out of FreshMart</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {userRole === 'admin' ? 'Edit Admin Profile' : 'Edit Customer Profile'}
              </Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Avatar Logo Preview & Selector */}
              <View style={styles.modalAvatarPreviewContainer}>
                <View style={styles.modalLogoAvatarPreview}>
                  <Ionicons
                    name={editAvatarLogo}
                    size={42}
                    color={colors.primaryDark}
                  />
                </View>
                <Text style={styles.avatarColorLabel}>Select Profile Logo Icon</Text>
                <View style={styles.logoIconsRow}>
                  {LOGO_OPTIONS.map((opt) => {
                    const isSelected = editAvatarLogo === opt.id;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        onPress={() => setEditAvatarLogo(opt.id)}
                        style={[
                          styles.logoPickOption,
                          isSelected && styles.logoPickOptionSelected,
                        ]}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={opt.id}
                          size={22}
                          color={isSelected ? colors.primaryDark : colors.textMuted}
                        />
                        <Text
                          style={[
                            styles.logoPickText,
                            isSelected && styles.logoPickTextSelected,
                          ]}
                        >
                          {opt.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Name */}
              <View style={styles.modalField}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={[styles.modalInput, errors.name && styles.inputError]}
                  value={editName}
                  onChangeText={(t) => {
                    setEditName(t);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                  }}
                  placeholder="Enter your name"
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* Email */}
              <View style={styles.modalField}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <TextInput
                  style={[styles.modalInput, errors.email && styles.inputError]}
                  value={editEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(t) => {
                    setEditEmail(t);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  placeholder="user@rvscas.ac.in"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Phone */}
              <View style={styles.modalField}>
                <Text style={styles.inputLabel}>Mobile Phone (10 Digits) *</Text>
                <TextInput
                  style={[styles.modalInput, errors.phone && styles.inputError]}
                  value={editPhone}
                  keyboardType="phone-pad"
                  maxLength={10}
                  onChangeText={(t) => {
                    setEditPhone(t);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                  }}
                  placeholder="9876543210"
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>

              {/* Address */}
              <View style={styles.modalField}>
                <Text style={styles.inputLabel}>Delivery Address *</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextArea, errors.address && styles.inputError]}
                  value={editAddress}
                  multiline
                  numberOfLines={3}
                  onChangeText={(t) => {
                    setEditAddress(t);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: null }));
                  }}
                  placeholder="Street, locality, city, pincode"
                />
                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveProfileBtn}
                onPress={handleSaveProfile}
                activeOpacity={0.85}
              >
                <Ionicons name="save-outline" size={18} color="#fff" />
                <Text style={styles.saveProfileText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  logoAvatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#A7F3D0',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  logoAvatarInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
  },
  avatarEditBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  userPhone: {
    fontSize: 13,
    color: colors.textMedium,
    marginTop: 2,
    fontWeight: '500',
  },
  roleBadgeContainer: {
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  customerRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.customerBadgeLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  customerRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  memberSince: {
    fontSize: 11,
    color: colors.textLight,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    gap: 6,
  },
  editProfileText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDark,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
  },
  sectionActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  addressText: {
    fontSize: 13,
    color: colors.textMedium,
    marginTop: 8,
    lineHeight: 18,
  },
  ordersList: {
    marginTop: 12,
    gap: 10,
  },
  orderItem: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
  },
  statusBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  orderDate: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  orderItemsPreview: {
    fontSize: 12,
    color: colors.textMedium,
    marginTop: 4,
  },
  orderBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  orderTotal: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
  },
  orderCount: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingTextCol: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  settingDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.dangerLight,
    gap: 8,
    marginTop: 6,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBody: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  modalAvatarPreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.surfaceSubtle,
    padding: 16,
    borderRadius: 16,
  },
  modalLogoAvatarPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2.5,
    borderColor: '#A7F3D0',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarColorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMedium,
    marginBottom: 10,
  },
  logoIconsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  logoPickOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.border,
    minWidth: 54,
  },
  logoPickOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  logoPickText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 4,
  },
  logoPickTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  modalField: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textDark,
  },
  modalTextArea: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: colors.danger,
    fontSize: 11,
    marginTop: 4,
  },
  saveProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  saveProfileText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

