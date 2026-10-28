import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FAQS } from '../../utils/mockData';

export default function HelpFAQsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('FAQ'); // 'FAQ' | 'Contact'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const filteredFaqs = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Notch-Safe Header */}
      <View
        style={[
          styles.headerBanner,
          {
            paddingTop: Math.max(insets.top, 24) + 10,
            paddingBottom: 20,
          },
        ]}
      >
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.navCircleBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#1E1238" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Help & FAQS</Text>

          <TouchableOpacity
            style={styles.navCircleBtn}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color="#1E1238" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Curved Sheet */}
      <View style={styles.sheetContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom, 20) + 30,
          }}
        >
          <Text style={styles.headingTitle}>How Can We Help You?</Text>

          {/* FAQ vs Contact Us Tabs */}
          <View style={styles.tabPillsRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'FAQ' && styles.tabBtnActive]}
              onPress={() => setActiveTab('FAQ')}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'FAQ' && styles.tabBtnTextActive,
                ]}
              >
                FAQ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'Contact' && styles.tabBtnActive,
              ]}
              onPress={() => setActiveTab('Contact')}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'Contact' && styles.tabBtnTextActive,
                ]}
              >
                Contact Us
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'FAQ' ? (
            <>
              {/* Search Bar */}
              <View style={styles.searchWrapper}>
                <Ionicons name="search-outline" size={18} color="#A0AEC0" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search questions or keywords..."
                  placeholderTextColor="#A0AEC0"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* FAQ Accordion List */}
              {filteredFaqs.map((faq, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <View key={idx} style={styles.faqCard}>
                    <TouchableOpacity
                      style={styles.faqHeader}
                      onPress={() => toggleExpand(idx)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.faqQuestion}>{faq.q}</Text>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#FF6B00"
                      />
                    </TouchableOpacity>
                    {isExpanded && (
                      <View style={styles.faqBody}>
                        <Text style={styles.faqAnswer}>{faq.a}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </>
          ) : (
            /* Contact Us Channels */
            <View style={styles.contactList}>
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => Linking.openURL('mailto:support@poojaapp.in')}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name="headset-outline" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.contactName}>Customer Service</Text>
                <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => Linking.openURL('https://poojaapp.in')}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name="globe-outline" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.contactName}>Official Website</Text>
                <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => Linking.openURL('https://wa.me/919876543210')}
              >
                <View style={[styles.contactIcon, { backgroundColor: '#25D366' }]}>
                  <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.contactName}>WhatsApp Support</Text>
                <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E40AF',
  },
  headerBanner: {
    paddingHorizontal: 20,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1238',
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: '#EBF5FF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  headingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1238',
    textAlign: 'center',
    marginBottom: 14,
  },
  tabPillsRow: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    borderRadius: 24,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  tabBtnActive: {
    backgroundColor: '#FF6B00',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E1238',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#1E1238',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1238',
    flex: 1,
    paddingRight: 10,
  },
  faqBody: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  faqAnswer: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 19,
  },
  contactList: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E1238',
  },
});

