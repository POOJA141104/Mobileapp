import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite, addToCart, cart, updateCartQuantity } = useApp();

  const [quantity, setQuantity] = useState(1);

  const isFav = isFavorite(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleIncrement = () => {
    if (quantity < (product.stock || 50)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      {/* Scrollable details */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image Container */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Floating Navigation Controls */}
          <View
            style={[
              styles.floatingHeader,
              { top: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 16) + 6 },
            ]}
          >
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={22} color={colors.textDark} />
            </TouchableOpacity>

            <View style={styles.headerRightActions}>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => toggleFavorite(product)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFav ? colors.danger : colors.textDark}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => navigation.navigate('Cart')}
                activeOpacity={0.8}
              >
                <Ionicons name="cart-outline" size={22} color={colors.textDark} />
                {totalCartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{totalCartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Product Badges */}
          <View style={styles.floatingBadges}>
            {product.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>{product.discount}</Text>
              </View>
            )}
            {product.isOrganic && (
              <View style={styles.organicBadge}>
                <Ionicons name="leaf" size={12} color="#fff" />
                <Text style={styles.organicBadgeText}>100% ORGANIC</Text>
              </View>
            )}
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.contentCard}>
          {/* Rating & Stock */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FBBF24" />
              <Text style={styles.ratingVal}>{product.rating}</Text>
              <Text style={styles.ratingCount}>({product.reviewsCount} reviews)</Text>
            </View>

            <View
              style={[
                styles.stockBadge,
                { backgroundColor: product.stock > 0 ? colors.primaryLight : '#FEE2E2' },
              ]}
            >
              <Text
                style={[
                  styles.stockBadgeText,
                  { color: product.stock > 0 ? colors.primaryDark : colors.danger },
                ]}
              >
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {/* Product Title & Unit */}
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.unitText}>{product.unit}</Text>

          {/* Price Row */}
          <View style={styles.priceRow}>
            <View style={styles.priceGroup}>
              <Text style={styles.currentPrice}>₹{product.price}</Text>
              {product.originalPrice && (
                <Text style={styles.origPrice}>₹{product.originalPrice}</Text>
              )}
            </View>
            <Text style={styles.inclusiveText}>Inclusive of all taxes</Text>
          </View>

          {/* Fast Delivery Info Box */}
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryIconCircle}>
              <Ionicons name="flash" size={18} color="#D97706" />
            </View>
            <View style={styles.deliveryTextCol}>
              <Text style={styles.deliveryTitle}>Lightning Fast Delivery</Text>
              <Text style={styles.deliveryDesc}>
                Guaranteed delivery in 15-20 minutes to your doorstep.
              </Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Nutritional Facts */}
          {product.nutrients && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutritional Value (Per 100g)</Text>
              <View style={styles.nutrientsGrid}>
                <View style={styles.nutrientBox}>
                  <Text style={styles.nutrientVal}>{product.nutrients.calories}</Text>
                  <Text style={styles.nutrientLabel}>Calories</Text>
                </View>
                <View style={styles.nutrientBox}>
                  <Text style={styles.nutrientVal}>{product.nutrients.carbs}</Text>
                  <Text style={styles.nutrientLabel}>Carbs</Text>
                </View>
                <View style={styles.nutrientBox}>
                  <Text style={styles.nutrientVal}>{product.nutrients.protein}</Text>
                  <Text style={styles.nutrientLabel}>Protein</Text>
                </View>
                <View style={styles.nutrientBox}>
                  <Text style={styles.nutrientVal}>{product.nutrients.fiber}</Text>
                  <Text style={styles.nutrientLabel}>Fiber</Text>
                </View>
              </View>
            </View>
          )}

          {/* Origin & Shelf Life */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Origin & Storage Details</Text>
            <View style={styles.infoRow}>
              <Ionicons name="earth-outline" size={18} color={colors.primary} />
              <Text style={styles.infoKey}>Source Origin: </Text>
              <Text style={styles.infoVal}>{product.origin || 'Organic Certified Farms'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color={colors.primary} />
              <Text style={styles.infoKey}>Shelf Life: </Text>
              <Text style={styles.infoVal}>{product.shelfLife || '3-5 days fresh'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {/* Quantity Stepper */}
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={handleDecrement}
            disabled={quantity <= 1}
          >
            <Ionicons
              name="remove"
              size={18}
              color={quantity <= 1 ? colors.textLight : colors.textDark}
            />
          </TouchableOpacity>

          <Text style={styles.stepperValue}>{quantity}</Text>

          <TouchableOpacity style={styles.stepperBtn} onPress={handleIncrement}>
            <Ionicons name="add" size={18} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.mainAddToCartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={styles.mainAddToCartText}>
            Add to Cart • ₹{product.price * quantity}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 10,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  floatingBadges: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  discountBadge: {
    backgroundColor: colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  discountBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  organicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  organicBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  contentCard: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#fff',
    marginTop: -20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  ratingCount: {
    fontSize: 11,
    color: '#B45309',
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textDark,
    marginTop: 4,
  },
  unitText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  currentPrice: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textDark,
  },
  origPrice: {
    fontSize: 16,
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  inclusiveText: {
    fontSize: 11,
    color: colors.textLight,
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  deliveryIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  deliveryTextCol: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  deliveryDesc: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  section: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: colors.textMedium,
    lineHeight: 20,
  },
  nutrientsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  nutrientBox: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  nutrientVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
  },
  nutrientLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  infoKey: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    paddingHorizontal: 12,
  },
  mainAddToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  mainAddToCartText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

