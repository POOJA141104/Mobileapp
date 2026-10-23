# FreshMart - Modern Grocery Shop Mobile App
### RVS College of Arts and Science (Autonomous)
**School of Computer Studies (SCS) - MCA Batch 2025 Semester – III**  
**Core Elective-II: Mobile App Development using React Native**  
**Model Examinations Oct 2026 - Major Hackathon Requirements (Duration: 6 Hours | Total Marks: 75)**

---

## 🚀 Quick Run Instructions

The app is already initialized, configured, and running!

### Dev Server:
```bash
# Start dev server (Metro Bundler)
npx expo start --port 8081

# Or open directly in Web Browser:
npm run web

# Or run on Android Emulator / Physical Device:
npm run android

# Or run on iOS Simulator (macOS):
npm run ios
```

Once running, navigate to:  
👉 **`http://localhost:8081`** in any web browser, or scan the QR code with **Expo Go** on Android/iOS!

---

## 📋 Evaluation Checklist & Marks Breakdown

### Part – I: React Native Screens (30 Marks)
| Screen | Description & Functionality | Marks | Status |
|---|---|:---:|:---:|
| **1. Home Screen (Sign Up & Sign In)** | Dual role (Admin & Customer), validation (email, password min 6, phone 10-digits), quick 1-click evaluation logins | 5 | ✅ Complete |
| **2. Daily Grocery Products List** | Search bar with live filtering, category pills, banner offer, discount tags, rating stars, "+ Add" / quantity steppers, Admin Add/Edit/Delete actions | 5 | ✅ Complete |
| **3. Profile and Edit Profile Screen** | Customer avatar selector, editable profile details with form validation, recent orders list, preferences toggles, sign-out | 5 | ✅ Complete |
| **4. Add Favorite Screen** | Wishlisted products list, remove from favorites, individual add-to-cart, one-click "Add All to Cart" button | 5 | ✅ Complete |
| **5. Product Details Screen** | Hero image showcase, nutrition breakdown, shelf life & origin, live stock status, interactive quantity counter, dynamic price calculation | 5 | ✅ Complete |
| **6. My Cart Screen** | Cart items with +/- stepper controls, delete button, promo coupon engine (`FRESH50`, `SAVE20`, `RVS100`), delivery fee & taxes breakdown, checkout modal | 5 | ✅ Complete |

### Part – II: React Navigation (30 Marks)
| Navigation Type | Implementation | Marks | Status |
|---|---|:---:|:---:|
| **(i) Stack Navigation** | `createNativeStackNavigator` managing Auth, Main Drawer/Tabs, Product Details, Cart, Favorites, Profile | 10 | ✅ Complete |
| **(ii) Tabs Navigation** | `createBottomTabNavigator` with custom icons, badge notifications (cart items count & favorites count), and active theme colors | 10 | ✅ Complete |
| **(iii) Drawer Navigation** | `createDrawerNavigator` with custom header, user card, role switcher, links to all app modules, and sign out | 10 | ✅ Complete |

### Part – III: Functional Requirements (15 Marks)
| Requirement | Description | Marks | Status |
|---|---|:---:|:---:|
| **(i) Screen Navigation** | All users can navigate between all screens via Drawer, Bottom Tabs, Stack transitions, and Header buttons | 5 | ✅ Complete |
| **(ii) Add Products to Cart** | Add single or multiple products from Products screen and/or Favorites screen to cart | 5 | ✅ Complete |
| **(iii) Add / Subtract in Cart** | Real-time `+` and `-` quantity controls in Cart screen with dynamic bill recalculations | 5 | ✅ Complete |

---

## 🎨 Figma Design Alignment (>75% Matching)
- **Palette**: Emerald Fresh Green (`#10B981`, `#059669`), warm accent amber (`#F59E0B`), coral red for discounts (`#EF4444`).
- **Cards & Layout**: Rounded `16px` borders, soft drop shadows, clean typography, badge pills.
- **Micro-Interactions**: Floating cart badges, toast notifications on all cart/favorite actions, interactive quantity steppers.

## 👥 Dual User Mode Demo
- **Customer**: Browse products, search, filter categories, view product details, toggle favorites, add to cart, edit customer profile, place orders.
- **Admin**: Add new grocery products into the catalog with price/stock/unit validation, edit product details, delete items from store, view store cart status.
- **Quick Switch**: Tap the Role Badge in the header or the Drawer to instantly toggle between Admin and Customer modes!

