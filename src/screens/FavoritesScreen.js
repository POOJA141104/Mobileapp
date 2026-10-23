import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';

export const FavoritesScreen = ({ navigation }) => {
  const {
    getFavoriteProducts,
    toggleFavorite,
    addToCart,
    addAllFavoritesToCart,
    cart,
    updateCartQuantity,
  } = useApp();

  const favoriteProducts = getFavoriteProducts();

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="heart-dislike-outline" size={48} color={colors.danger} />
      </View>
      <Text style={styles.emptyTitle}>No Favorite Items Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the heart icon on any product in the store to save it to your favorites list for quick access!
      </Text>
      <TouchableOpacity
        style={styles.exploreBtn}
        onPress={() => navigation.navigate('Products')}
        activeOpacity={0.85}
      >
        <Ionicons name="storefront-outline" size={18} color="#fff" />
        <Text style={styles.exploreBtnText}>Browse Daily Groceries</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    const cartItem = cart.find((c) => c.product.id === item.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category?.toUpperCase()}</Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleFavorite(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="heart" size={22} color={colors.danger} />
            </TouchableOpacity>
          </View>

          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.unit}>{item.unit}</Text>

          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.price}>₹{item.price}</Text>
              {item.originalPrice && (
                <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
              )}
            </View>

            {quantityInCart > 0 ? (
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateCartQuantity(item.id, -1)}
                >
                  <Ionicons name="remove" size={14} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.qtyCount}>{quantityInCart}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateCartQuantity(item.id, 1)}
                >
                  <Ionicons name="add" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addToCartBtn}
                onPress={() => addToCart(item, 1)}
                activeOpacity={0.8}
              >
                <Ionicons name="cart-outline" size={16} color="#fff" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Saved Favorites"
        subtitle={`${favoriteProducts.length} items wishlisted`}
        showDrawer={true}
        showCart={true}
      />

      {favoriteProducts.length > 0 && (
        <View style={styles.actionBar}>
          <Text style={styles.actionBarTitle}>
            Saved Products ({favoriteProducts.length})
          </Text>
          <TouchableOpacity
            style={styles.addAllBtn}
            onPress={addAllFavoritesToCart}
            activeOpacity={0.8}
          >
            <Ionicons name="cart" size={16} color={colors.primaryDark} />
            <Text style={styles.addAllBtnText}>Add All to Cart</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  actionBarTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
  },
  addAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  addAllBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: 105,
    height: 105,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 2,
  },
  unit: {
    fontSize: 11,
    color: colors.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
  },
  originalPrice: {
    fontSize: 10,
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyCount: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    paddingHorizontal: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
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
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    marginTop: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  exploreBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

