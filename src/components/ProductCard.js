import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export const ProductCard = ({ product, onEditProduct }) => {
  const navigation = useNavigation();
  const { isFavorite, toggleFavorite, cart, addToCart, updateCartQuantity, userRole, adminDeleteProduct } =
    useApp();

  const isFav = isFavorite(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handlePress = () => {
    navigation.navigate('ProductDetails', { product });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* Top Media Area */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Badges */}
        <View style={styles.badgeRow}>
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}</Text>
            </View>
          )}
          {product.isOrganic && (
            <View style={styles.organicBadge}>
              <Text style={styles.organicText}>ORGANIC</Text>
            </View>
          )}
        </View>

        {/* Favorite Heart Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(product)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={18}
            color={isFav ? colors.danger : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Card Body */}
      <View style={styles.body}>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#FBBF24" />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewsText}>({product.reviewsCount})</Text>
          <Text style={styles.stockText}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </Text>
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.unit}>{product.unit}</Text>

        {/* Price & Action Row */}
        <View style={styles.footerRow}>
          <View style={styles.priceColumn}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}
          </View>

          {/* Cart Quantity Controls */}
          {quantityInCart > 0 ? (
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateCartQuantity(product.id, -1)}
              >
                <Ionicons name="remove" size={14} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantityInCart}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateCartQuantity(product.id, 1)}
              >
                <Ionicons name="add" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(product, 1)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Admin Controls Overlay if Admin */}
        {userRole === 'admin' && (
          <View style={styles.adminActionRow}>
            {onEditProduct && (
              <TouchableOpacity
                style={styles.adminMiniBtn}
                onPress={() => onEditProduct(product)}
              >
                <Ionicons name="create-outline" size={14} color={colors.primaryDark} />
                <Text style={styles.adminMiniBtnText}>Edit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.adminMiniBtn, { borderColor: colors.dangerLight }]}
              onPress={() => adminDeleteProduct(product.id)}
            >
              <Ionicons name="trash-outline" size={14} color={colors.danger} />
              <Text style={[styles.adminMiniBtnText, { color: colors.danger }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 14,
    overflow: 'hidden',
    width: '48%',
  },
  imageContainer: {
    height: 125,
    width: '100%',
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 4,
  },
  discountBadge: {
    backgroundColor: colors.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  organicBadge: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  organicText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  body: {
    padding: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textDark,
  },
  reviewsText: {
    fontSize: 10,
    color: colors.textLight,
  },
  stockText: {
    fontSize: 9,
    color: colors.primaryDark,
    marginLeft: 'auto',
    fontWeight: '600',
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
    lineHeight: 18,
    minHeight: 36,
  },
  unit: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceColumn: {
    flexDirection: 'column',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
  },
  originalPrice: {
    fontSize: 11,
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 3,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  qtyBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    paddingHorizontal: 6,
  },
  adminActionRow: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 6,
  },
  adminMiniBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
    gap: 3,
  },
  adminMiniBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMedium,
  },
});

