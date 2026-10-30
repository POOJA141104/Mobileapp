# Pooja - Smart Personal Finance & Budget Tracker Mobile App 🚀

A modern, responsive, mobile-first React Native application built with **Expo**, tailored for the **MCA Semester III • EoS Examinations October 2026 Hackathon**.

![Theme](https://img.shields.io/badge/Theme-Royal%20Blue%20%2B%20Orange-1E40AF?style=for-the-badge)
![Currency](https://img.shields.io/badge/Currency-Indian%20Rupees%20(%E2%82%B9)-FF6B00?style=for-the-badge)
![Framework](https://img.shields.io/badge/Framework-React%20Native%20%2F%20Expo%20SDK%2058-22C55E?style=for-the-badge)

---

## 🌟 Key Highlights & Rubric Implementation

### 1. Part I: Complete Core Screens (6 Screens)
- **Home Screen**: Balance card, dynamic financial report switcher (Daily / Weekly / Monthly), goals progress, recent activity, and quick expense logging.
- **Financial Analysis Screen**: Multi-period bar charts (Day / Week / Month / Year), interactive Financial Calendar with detailed daily breakdown & transaction logs in ₹, income vs. expense cashflow metrics, and savings targets.
- **Profile & Edit Profile Screen**: Dynamic user initial avatar, account details, role badge (Customer / Admin), and user preferences.
- **Transactions Screen (Month-wise)**: Categorized chronological timeline grouped by months (April, March, February 2024), income/expense filters, and Indian Rupee formatting.
- **Overall Categories Screen**: Grid and list views of spending categories with allocated budgets and spent amounts.
- **Category Details Screen**: Drill-down view into transactions under specific categories with add-expense capability.

### 2. Part II: All 3 React Navigation Patterns
- **Stack Navigation**: Root screen transitions (`AuthStack` -> `MainDrawer` -> `CategoryDetails`, `AddExpense`, `EditProfile`, etc.) with smooth slide animations.
- **Bottom Tabs Navigation**: Custom floating pill tab bar with active indicator (`Home`, `Analysis`, `Transactions`, `Categories`, `Profile`).
- **Drawer Navigation**: Comprehensive side navigation drawer styled in **Royal Blue** (`#1E40AF`) with quick role switching, user profile header, and section shortcuts.

### 3. Part III: Functional Requirements
- **Dual User Roles (Admin / Customer)**: Multi-user role toggle across the entire application with personalized views.
- **Personalized Alerts & Welcome Banners**: Real-time notifications addressing users by name on login and instant animated feedback on every budget / expense addition.
- **Dynamic Report Period Selector**: Instant state recalculations for Daily, Weekly, and Monthly balance reports on the Home dashboard.
- **Indian Rupee Formatting (`₹`)**: All monetary figures formatted in Indian standard numbering (e.g., `₹77,830`).
- **Notch-Safe Layouts**: Dynamic safe area insets to prevent collisions with camera notches, status bars, and Dynamic Island.

---

## 🎨 Theme & Palette

- **Sidebar (Drawer)**: Royal Blue (`#1E40AF` / `#172554`)
- **Action Buttons & Accents**: Bold Energetic Orange (`#FF6B00`)
- **Background**: Light Blue (`#EBF5FF` / `#DBEAFE`)
- **Surface Cards**: Crisp White (`#FFFFFF`) with Soft Border Outlines (`#BFDBFE`)

---

## 📂 Project Directory Structure

```text
├── App.js                     # Root entry point with SafeAreaProvider & AppProvider
├── app.json                   # Expo configuration & app metadata
├── eas.json                   # EAS build configuration (APK & iOS)
├── src/
│   ├── components/            # Header, TransactionItem, PersonalizedAlert
│   ├── context/               # AppContext (global state, auth, INR storage)
│   ├── navigation/            # AppNavigator, CustomTabBar, CustomDrawerContent
│   ├── screens/
│   │   ├── auth/              # LaunchScreen, LoginScreen, SignUpScreen
│   │   └── main/              # Home, Analysis, Transactions, Categories, etc.
│   └── utils/                 # currency.js (formatINR), mockData.js
└── assets/                    # Icons and assets
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Expo Go App on Android / iOS

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/POOJA141104/Mobileapp.git

# Navigate to directory
cd Mobileapp

# Install dependencies
npm install

# Start the Expo development server
npx expo start --tunnel --go
```

Scan the terminal QR code using **Expo Go** on Android or the Camera app on iOS!

---

## 👩‍💻 Author
- **GitHub**: [@POOJA141104](https://github.com/POOJA141104)
- **Examination**: MCA Semester III • EoS Examinations Oct 2026

