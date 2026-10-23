import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { CategoryPills } from '../components/CategoryPills';
import { ProductCard } from '../components/ProductCard';
import { AdminProductModal } from '../components/AdminProductModal';
import { colors } from '../theme/colors';

export const ProductsListScreen = () => {
  const { products, userRole, adminAddProduct, adminUpdateProduct } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price_low', 'rating'

  // Admin Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // Default popular order
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setModalVisible(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setModalVisible(true);
  };

  const handleModalSubmit = (productData) => {
    if (editingProduct) {
      adminUpdateProduct(productData);
    } else {
      adminAddProduct(productData);
    }
  };

  const renderHeader = () => (
    <View>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search fresh vegetables, fruits, dairy, bakery..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Promotional Banner */}
      <View style={styles.promoBanner}>
        <View style={styles.promoContent}>
          <View style={styles.promoTag}>
            <Text style={styles.promoTagText}>TODAY'S SPECIAL</Text>
          </View>
          <Text style={styles.promoTitle}>Farm Fresh Daily Essentials</Text>
          <Text style={styles.promoSubtitle}>Get up to 30% discount on organic products!</Text>
        </View>
        <Ionicons name="leaf" size={48} color="rgba(255,255,255,0.25)" style={styles.promoIcon} />
      </View>

      {/* Category Pills */}
      <CategoryPills
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* List Meta & Sort Controls */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          Showing <Text style={styles.metaHighlight}>{filteredProducts.length}</Text> groceries
        </Text>

        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'popular' && styles.activeSortChip]}
            onPress={() => setSortBy('popular')}
          >
            <Text style={[styles.sortChipText, sortBy === 'popular' && styles.activeSortChipText]}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'price_low' && styles.activeSortChip]}
            onPress={() => setSortBy('price_low')}
          >
            <Text style={[styles.sortChipText, sortBy === 'price_low' && styles.activeSortChipText]}>
              Price ↓
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'rating' && styles.activeSortChip]}
            onPress={() => setSortBy('rating')}
          >
            <Text style={[styles.sortChipText, sortBy === 'rating' && styles.activeSortChipText]}>
              Rating ⭐
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={colors.textLight} />
      <Text style={styles.emptyTitle}>No Grocery Items Found</Text>
      <Text style={styles.emptySubtitle}>
        We couldn't find any items matching "{searchQuery}". Try searching for fruits, milk, or broccoli!
      </Text>
      <TouchableOpacity
        style={styles.clearSearchBtn}
        onPress={() => {
          setSearchQuery('');
          setSelectedCategory('all');
        }}
      >
        <Text style={styles.clearSearchText}>View All Products</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Fresh Grocery Mart"
        subtitle="Sulur, Coimbatore • 15 Mins"
        showDrawer={true}
        showCart={true}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onEditProduct={userRole === 'admin' ? handleOpenEditModal : null}
          />
        )}
      />

      {/* Admin Floating Add Product Button */}
      {userRole === 'admin' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleOpenAddModal}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={26} color="#fff" />
          <Text style={styles.fabText}>Add Product</Text>
        </TouchableOpacity>
      )}

      {/* Admin Add/Edit Modal */}
      <AdminProductModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        initialProduct={editingProduct}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 80,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
  },
  promoBanner: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: colors.primaryDark,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  promoContent: {
    flex: 1,
    zIndex: 2,
  },
  promoTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  promoTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  promoSubtitle: {
    color: '#E6FFFA',
    fontSize: 12,
    marginTop: 2,
  },
  promoIcon: {
    position: 'absolute',
    right: 12,
    bottom: -6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
  },
  metaText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  metaHighlight: {
    fontWeight: '700',
    color: colors.textDark,
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  sortChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeSortChip: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  sortChipText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  activeSortChipText: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  clearSearchBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  clearSearchText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.adminBadge,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 28,
    shadowColor: colors.adminBadge,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    gap: 6,
    zIndex: 999,
  },
  fabText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

