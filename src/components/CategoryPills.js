import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../data/mockData';
import { colors } from '../theme/colors';

export const CategoryPills = ({ selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.pill,
                isSelected && styles.activePill,
              ]}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={isSelected ? '#fff' : colors.textMedium}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.activePillText,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activePill: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMedium,
  },
  activePillText: {
    color: '#fff',
    fontWeight: '700',
  },
});

