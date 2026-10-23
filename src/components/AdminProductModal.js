import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../data/mockData';
import { colors } from '../theme/colors';

export const AdminProductModal = ({
  visible,
  onClose,
  onSubmit,
  initialProduct = null,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('vegetables');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('1 kg');
  const [stock, setStock] = useState('20');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      setCategory(initialProduct.category || 'vegetables');
      setPrice(String(initialProduct.price || ''));
      setUnit(initialProduct.unit || '1 kg');
      setStock(String(initialProduct.stock || '20'));
      setImage(initialProduct.image || '');
      setDescription(initialProduct.description || '');
    } else {
      setName('');
      setCategory('vegetables');
      setPrice('');
      setUnit('1 kg');
      setStock('25');
      setImage('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
      setDescription('');
    }
    setErrors({});
  }, [initialProduct, visible]);

  const handleSubmit = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Product name is required';
    if (!price.trim() || isNaN(price) || parseFloat(price) <= 0) {
      errs.price = 'Enter a valid price greater than 0';
    }
    if (!stock.trim() || isNaN(stock) || parseInt(stock, 10) < 0) {
      errs.stock = 'Enter valid stock count';
    }
    if (!unit.trim()) errs.unit = 'Unit is required (e.g. 1 kg, 500g)';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      ...(initialProduct || {}),
      name: name.trim(),
      category,
      price: parseFloat(price),
      unit: unit.trim(),
      stock: parseInt(stock, 10),
      image: image.trim() || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      description: description.trim() || 'Farm fresh quality grocery item handpicked for high nutritional value.',
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>
                {initialProduct ? 'Edit Grocery Product' : 'Add New Grocery Product'}
              </Text>
              <Text style={styles.headerSubtitle}>Admin Catalog Management</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollArea}
          >
            {/* Product Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="e.g. Fresh Red Strawberries"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Category Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.catChip,
                      category === cat.id && styles.activeCatChip,
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Text
                      style={[
                        styles.catChipText,
                        category === cat.id && styles.activeCatChipText,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Price & Unit Row */}
            <View style={styles.row}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Price (₹) *</Text>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  placeholder="e.g. 120"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={(t) => {
                    setPrice(t);
                    if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
                  }}
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Unit / Weight *</Text>
                <TextInput
                  style={[styles.input, errors.unit && styles.inputError]}
                  placeholder="e.g. 1 kg or 500g"
                  value={unit}
                  onChangeText={(t) => {
                    setUnit(t);
                    if (errors.unit) setErrors((prev) => ({ ...prev, unit: null }));
                  }}
                />
                {errors.unit && <Text style={styles.errorText}>{errors.unit}</Text>}
              </View>
            </View>

            {/* Stock Count & Image URL */}
            <View style={styles.row}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Initial Stock Qty *</Text>
                <TextInput
                  style={[styles.input, errors.stock && styles.inputError]}
                  placeholder="e.g. 30"
                  keyboardType="number-pad"
                  value={stock}
                  onChangeText={(t) => {
                    setStock(t);
                    if (errors.stock) setErrors((prev) => ({ ...prev, stock: null }));
                  }}
                />
                {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
              </View>

              <View style={[styles.fieldGroup, { flex: 1.5 }]}>
                <Text style={styles.label}>Image URL (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Paste image link"
                  value={image}
                  onChangeText={setImage}
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Product Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe freshness, benefits, and storage instructions..."
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.submitBtnText}>
                {initialProduct ? 'Update Product' : 'Add to Grocery Catalog'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceSubtle,
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textDark,
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
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  catRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  activeCatChip: {
    backgroundColor: colors.adminBadge,
    borderColor: colors.adminBadge,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMedium,
  },
  activeCatChipText: {
    color: '#fff',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.adminBadge,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
    gap: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

