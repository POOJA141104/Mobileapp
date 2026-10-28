import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, role, logout } = useApp();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);
    logout();
  };

  const menuItems = [
    {
      id: 'edit_profile',
      title: 'Edit Profile',
      icon: 'person-outline',
      action: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'security',
      title: 'Security',
      icon: 'shield-outline',
      action: () => navigation.navigate('Security'),
    },
    {
      id: 'setting',
      title: 'Setting',
      icon: 'settings-outline',
      action: () => navigation.navigate('Settings'),
    },
    {
      id: 'help',
      title: 'Help',
      icon: 'help-circle-outline',
      action: () => navigation.navigate('HelpFAQs'),
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: 'log-out-outline',
      action: () => setLogoutModalVisible(true),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 90,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Notch-Safe Header */}
        <View
          style={[
            styles.headerBanner,
            {
              paddingTop: Math.max(insets.top, 24) + 10,
              paddingBottom: 55, // Extra room for overlapping avatar
            },
          ]}
        >
          <View style={styles.topNavRow}>
            <TouchableOpacity
              style={styles.navCircleBtn}
              onPress={() => navigation.openDrawer()}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={22} color="#1E1238" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Profile</Text>

            <TouchableOpacity
              style={styles.navCircleBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={20} color="#1E1238" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Curved Body Sheet */}
        <View style={styles.sheetContainer}>
          {/* Overlapping Avatar with User's First Letter */}
          <View style={styles.avatarWrapper}>
            <View style={styles.initialAvatarCircle}>
              <Text style={styles.initialAvatarText}>
                {user.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          </View>

          {/* User Name and Customer ID */}
          <View style={styles.userInfoBlock}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userId}>ID: {user.id}</Text>
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>{role} Account</Text>
            </View>
          </View>

          {/* Customer Menu List (Matching Figma Design) */}
          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuRow}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconCircle}>
                  <Ionicons name={item.icon} size={22} color="#FFFFFF" />
                </View>

                <Text style={styles.menuTitle}>{item.title}</Text>

                <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* End Session / Logout Modal (Matching Screenshot 093708.png) */}
      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>End Session</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to log out?
            </Text>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={handleConfirmLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.modalPrimaryBtnText}>Yes, End Session</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryBtn}
              onPress={() => setLogoutModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalSecondaryBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    position: 'relative',
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
    paddingHorizontal: 24,
    paddingTop: 10,
    minHeight: 500,
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginTop: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#EBF5FF',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
    backgroundColor: '#FF6B00',
  },
  initialAvatarCircle: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialAvatarText: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userInfoBlock: {
    alignItems: 'center',
    marginVertical: 14,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1238',
  },
  userId: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
    marginTop: 2,
  },
  roleTag: {
    marginTop: 6,
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C2410C',
  },
  menuList: {
    marginTop: 10,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  menuIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#60A5FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1238',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1238',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalPrimaryBtn: {
    width: '100%',
    backgroundColor: '#FF6B00',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalSecondaryBtn: {
    width: '100%',
    backgroundColor: '#DBEAFE',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryBtnText: {
    color: '#1E40AF',
    fontSize: 15,
    fontWeight: '700',
  },
});

