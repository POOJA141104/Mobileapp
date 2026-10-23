import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';

export const CartScreen = ({ navigation }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    calculateTotals,
    checkoutOrder,
    currentUser,
    userRole,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const totals = calculateTotals();

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput('');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon or minimum order requirement not met.');
    }
  };

  const handleQuickApply = (code) => {
    setCouponInput(code);
    applyCoupon(code);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const order = checkoutOrder(currentUser.address, 'Cash on Delivery (COD)');
    setPlacedOrder(order);
    setIsSuccessModalVisible(true);
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="cart-outline" size={54} color={colors.textLight} />
      </View>
      <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Looks like you haven't added anything to your cart yet. Explore our fresh grocery selection and stock up your kitchen!
      </Text>
      <TouchableOpacity
        style={styles.startShoppingBtn}
        onPress={() => navigation.navigate('Products')}
        activeOpacity={0.85}
      >
        <Ionicons name="bag-handle-outline" size={18} color="#fff" />
        <Text style={styles.startShoppingText}>Start Shopping Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartItem = ({ item }) => {
    const { product, quantity } = item;
    const itemTotal = product.price * quantity;

    return (
      <View style={styles.cartCard}>
        <Image source={{ uri: product.image }} style={styles.itemImage} resizeMode="cover" />

        <View style={styles.itemDetails}>
          <View style={styles.itemTopRow}>
            <Text style={styles.itemName} numberOfLines={1}>
              {product.name}
            </Text>
            <TouchableOpacity
              onPress={() => removeFromCart(product.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemUnit}>{product.unit}</Text>

          <View style={styles.itemBottomRow}>
            <View>
              <Text style={styles.itemPrice}>₹{product.price} each</Text>
              <Text style={styles.itemSubtotal}>Total: ₹{itemTotal}</Text>
            </View>

            {/* Stepper (+ and - buttons) */}
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperAction}
                onPress={() => updateCartQuantity(product.id, -1)}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={14} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.stepperQty}>{quantity}</Text>

              <TouchableOpacity
                style={styles.stepperAction}
                onPress={() => updateCartQuantity(product.id, 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Admin Store Notice */}
      {userRole === 'admin' && (
        <View style={styles.adminBanner}>
          <Ionicons name="shield-checkmark" size={18} color={colors.adminBadge} />
          <Text style={styles.adminBannerText}>
            Admin View: Order simulation and live cart inspector active.
          </Text>
        </View>
      )}

      {/* Delivery Address Pill */}
      <View style={styles.addressBar}>
        <Ionicons name="location" size={20} color={colors.primary} />
        <View style={styles.addressCol}>
          <Text style={styles.addressLabel}>Delivering to Home</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {currentUser.address}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.changeAddressText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Title & Clear option */}
      <View style={styles.cartHeaderRow}>
        <Text style={styles.cartHeading}>
          Cart Items ({totals.totalItems})
        </Text>
        <TouchableOpacity onPress={clearCart} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.clearCartText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      {/* Coupon / Promo Code Section */}
      <View style={styles.cardSection}>
        <Text style={styles.sectionHeading}>Apply Discount Coupon</Text>

        {appliedCoupon ? (
          <View style={styles.appliedCouponRow}>
            <View style={styles.appliedCouponInfo}>
              <Ionicons name="pricetag" size={18} color={colors.primaryDark} />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.appliedCode}>{appliedCoupon.code}</Text>
                <Text style={styles.appliedLabel}>{appliedCoupon.label}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={removeCoupon} style={styles.removeCouponBtn}>
              <Text style={styles.removeCouponText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.couponInputWrapper}>
              <TextInput
                style={styles.couponInput}
                placeholder="Enter coupon code (e.g. FRESH50)"
                placeholderTextColor={colors.textLight}
                value={couponInput}
                autoCapitalize="characters"
                onChangeText={(t) => {
                  setCouponInput(t);
                  if (couponError) setCouponError('');
                }}
              />
              <TouchableOpacity
                style={styles.applyCouponBtn}
                onPress={handleApplyCoupon}
              >
                <Text style={styles.applyCouponBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
            {couponError ? <Text style={styles.errorText}>{couponError}</Text> : null}

            {/* Quick Coupon Suggestions */}
            <View style={styles.quickCouponsRow}>
              <Text style={styles.availableCouponsText}>Available: </Text>
              <TouchableOpacity
                style={styles.quickCouponChip}
                onPress={() => handleQuickApply('FRESH50')}
              >
                <Text style={styles.quickCouponChipText}>FRESH50</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickCouponChip}
                onPress={() => handleQuickApply('SAVE20')}
              >
                <Text style={styles.quickCouponChipText}>SAVE20</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickCouponChip}
                onPress={() => handleQuickApply('RVS100')}
              >
                <Text style={styles.quickCouponChipText}>RVS100</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Bill Details Breakdown */}
      <View style={styles.cardSection}>
        <Text style={styles.sectionHeading}>Bill Breakdown</Text>

        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Item Total ({totals.totalItems} items)</Text>
          <Text style={styles.billValue}>₹{totals.subtotal}</Text>
        </View>

        <View style={styles.billRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            {totals.deliveryFee === 0 && (
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>FREE</Text>
              </View>
            )}
          </View>
          <Text style={styles.billValue}>
            {totals.deliveryFee === 0 ? '₹0' : `₹${totals.deliveryFee}`}
          </Text>
        </View>

        {totals.discount > 0 && (
          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.primaryDark }]}>
              Coupon Discount ({appliedCoupon?.code})
            </Text>
            <Text style={[styles.billValue, { color: colors.primaryDark }]}>
              - ₹{totals.discount}
            </Text>
          </View>
        )}

        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Packaging & Taxes</Text>
          <Text style={styles.billValue}>₹{totals.taxesAndPacking}</Text>
        </View>

        <View style={[styles.billRow, styles.totalRow]}>
          <View>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.taxInclusiveText}>Taxes included</Text>
          </View>
          <Text style={styles.grandTotalValue}>₹{totals.grandTotal}</Text>
        </View>
      </View>

      {/* Checkout Button */}
      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={handleCheckout}
        activeOpacity={0.85}
      >
        <View style={styles.checkoutBtnLeft}>
          <Text style={styles.checkoutBtnTotal}>₹{totals.grandTotal}</Text>
          <Text style={styles.checkoutBtnItems}>{totals.totalItems} Items</Text>
        </View>
        <View style={styles.checkoutBtnRight}>
          <Text style={styles.checkoutBtnText}>Place Grocery Order</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="My Shopping Cart"
        subtitle={`${totals.totalItems} items in cart`}
        showDrawer={true}
        showCart={false}
      />

      {cart.length === 0 ? (
        renderEmptyCart()
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.product.id}
          renderItem={renderCartItem}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Order Success Modal */}
      <Modal visible={isSuccessModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={42} color="#fff" />
            </View>

            <Text style={styles.modalSuccessTitle}>Order Placed Successfully!</Text>
            <Text style={styles.modalOrderId}>Order ID: {placedOrder?.id}</Text>

            <View style={styles.modalSummaryBox}>
              <View style={styles.modalSummaryRow}>
                <Ionicons name="bicycle" size={18} color={colors.primaryDark} />
                <Text style={styles.modalSummaryText}>Estimated Delivery: 15-20 Mins</Text>
              </View>
              <View style={styles.modalSummaryRow}>
                <Ionicons name="location" size={18} color={colors.primaryDark} />
                <Text style={styles.modalSummaryText} numberOfLines={1}>
                  {placedOrder?.deliveryAddress}
                </Text>
              </View>
              <View style={styles.modalSummaryRow}>
                <Ionicons name="card" size={18} color={colors.primaryDark} />
                <Text style={styles.modalSummaryText}>Payment: Cash on Delivery</Text>
              </View>
              <View style={styles.modalSummaryRow}>
                <Ionicons name="cash" size={18} color={colors.primaryDark} />
                <Text style={styles.modalSummaryBold}>Total Paid: ₹{placedOrder?.total}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.continueShoppingBtn}
              onPress={() => {
                setIsSuccessModalVisible(false);
                navigation.navigate('Products');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
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
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.adminBadgeLight,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  adminBannerText: {
    fontSize: 12,
    color: colors.adminBadge,
    fontWeight: '600',
    flex: 1,
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  addressCol: {
    flex: 1,
    marginHorizontal: 10,
  },
  addressLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '600',
  },
  changeAddressText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  cartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cartHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
  },
  clearCartText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
  },
  cartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    flex: 1,
    marginRight: 6,
  },
  itemUnit: {
    fontSize: 11,
    color: colors.textMuted,
  },
  itemBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  itemPrice: {
    fontSize: 11,
    color: colors.textMuted,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textDark,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepperAction: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  stepperQty: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    paddingHorizontal: 8,
  },
  footerContainer: {
    marginTop: 8,
  },
  cardSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 10,
  },
  couponInputWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '600',
  },
  applyCouponBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyCouponBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  errorText: {
    color: colors.danger,
    fontSize: 11,
    marginTop: 6,
  },
  quickCouponsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  availableCouponsText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  quickCouponChip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  quickCouponChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  appliedCouponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    padding: 10,
    borderRadius: 12,
  },
  appliedCouponInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appliedCode: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  appliedLabel: {
    fontSize: 11,
    color: colors.primaryDark,
  },
  removeCouponBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  removeCouponText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  billLabel: {
    fontSize: 13,
    color: colors.textMedium,
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  freeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  freeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
  },
  taxInclusiveText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginTop: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutBtnLeft: {
    flexDirection: 'column',
  },
  checkoutBtnTotal: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
  },
  checkoutBtnItems: {
    color: '#D1FAE5',
    fontSize: 11,
    fontWeight: '600',
  },
  checkoutBtnRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 80,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  startShoppingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  startShoppingText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  modalSuccessTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
    textAlign: 'center',
  },
  modalOrderId: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 4,
  },
  modalSummaryBox: {
    width: '100%',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    padding: 14,
    marginVertical: 18,
    gap: 10,
  },
  modalSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalSummaryText: {
    fontSize: 12,
    color: colors.textMedium,
    flex: 1,
  },
  modalSummaryBold: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
  },
  continueShoppingBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

