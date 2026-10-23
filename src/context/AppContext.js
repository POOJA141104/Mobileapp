import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_PRODUCTS, INITIAL_USER, INITIAL_ADMIN, MOCK_COUPONS } from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(INITIAL_USER);
  const [userRole, setUserRole] = useState('customer'); // 'customer' or 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Products state (Admin can add/edit/delete)
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Favorites state (Product IDs)
  const [favoriteIds, setFavoriteIds] = useState(['prod_1', 'prod_4', 'prod_11']);

  // Cart state: [{ product, quantity }]
  const [cart, setCart] = useState([
    { product: INITIAL_PRODUCTS[0], quantity: 2 },
    { product: INITIAL_PRODUCTS[2], quantity: 1 },
  ]);

  // Promo code
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Completed orders
  const [orders, setOrders] = useState([
    {
      id: 'ORD-98214',
      date: '2026-10-20',
      itemsCount: 3,
      total: 325,
      status: 'Delivered',
      items: ['Fresh Organic Red Apples (2)', 'Organic Farm Tomatoes (1)'],
    },
  ]);

  // Notification helper
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2800);
  };

  // Auth Functions
  const login = (email, password, role = 'customer') => {
    if (role === 'admin') {
      setCurrentUser(INITIAL_ADMIN);
      setUserRole('admin');
    } else {
      setCurrentUser({
        ...INITIAL_USER,
        email: email || INITIAL_USER.email,
      });
      setUserRole('customer');
    }
    setIsAuthenticated(true);
    showToast(`Signed in successfully as ${role.toUpperCase()}!`, 'success');
  };

  const signup = (name, email, phone, password, role = 'customer') => {
    const newUser = {
      name,
      email,
      phone,
      address: 'Sulur, Coimbatore, Tamil Nadu',
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      memberSince: 'Oct 2026',
      ordersCount: 0,
    };
    setCurrentUser(newUser);
    setUserRole(role);
    setIsAuthenticated(true);
    showToast(`Welcome ${name}! Account created as ${role.toUpperCase()}.`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Signed out successfully.', 'info');
  };

  const switchUserRole = (newRole) => {
    if (newRole === 'admin') {
      setCurrentUser(INITIAL_ADMIN);
      setUserRole('admin');
      showToast('Switched to Admin Role!', 'success');
    } else {
      setCurrentUser(INITIAL_USER);
      setUserRole('customer');
      showToast('Switched to Customer Role!', 'success');
    }
  };

  // Profile update
  const updateUserProfile = (updatedFields) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
    showToast('Profile updated successfully!', 'success');
  };

  // Favorites Management
  const toggleFavorite = (product) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from favorites.`, 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Added "${product.name}" to favorites! ❤️`, 'success');
        return [...prev, product.id];
      }
    });
  };

  const isFavorite = (productId) => favoriteIds.includes(productId);

  const getFavoriteProducts = () => {
    return products.filter((p) => favoriteIds.includes(p.id));
  };

  // Cart Management
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        showToast(`Updated "${product.name}" quantity to ${newQty} in cart!`, 'success');
        return updated;
      } else {
        showToast(`Added ${quantity}x "${product.name}" to cart! 🛒`, 'success');
        return [...prev, { product, quantity }];
      }
    });
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (!existing) return prev;

      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        showToast(`Removed "${existing.product.name}" from cart.`, 'info');
        return prev.filter((item) => item.product.id !== productId);
      }

      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item) {
        showToast(`Removed "${item.product.name}" from cart.`, 'info');
      }
      return prev.filter((i) => i.product.id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    showToast('Cart has been cleared.', 'info');
  };

  const addAllFavoritesToCart = () => {
    const favProducts = getFavoriteProducts();
    if (favProducts.length === 0) {
      showToast('No favorite products to add!', 'warning');
      return;
    }

    setCart((prev) => {
      let updated = [...prev];
      favProducts.forEach((prod) => {
        const idx = updated.findIndex((item) => item.product.id === prod.id);
        if (idx > -1) {
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        } else {
          updated.push({ product: prod, quantity: 1 });
        }
      });
      return updated;
    });
    showToast(`Added all ${favProducts.length} favorites to cart! 🛒`, 'success');
  };

  // Coupons
  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = MOCK_COUPONS[cleanCode];

    if (!coupon) {
      showToast(`Invalid coupon code "${code}". Try FRESH50, SAVE20, or RVS100.`, 'danger');
      return false;
    }

    const { subtotal } = calculateTotals();
    if (subtotal < coupon.minOrder) {
      showToast(`Coupon requires minimum order of ₹${coupon.minOrder}.`, 'warning');
      return false;
    }

    setAppliedCoupon({ code: cleanCode, ...coupon });
    showToast(`Coupon "${cleanCode}" applied! 🎉`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  // Cart Calculations
  const calculateTotals = () => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discount) {
        discount = appliedCoupon.discount;
      } else if (appliedCoupon.percentage) {
        discount = Math.min((subtotal * appliedCoupon.percentage) / 100, appliedCoupon.maxDiscount || 9999);
      }
    }

    // Delivery fee: Free over ₹300, else ₹30
    const deliveryFee = subtotal > 300 || subtotal === 0 ? 0 : 30;
    const taxesAndPacking = subtotal > 0 ? 15 : 0;
    const grandTotal = Math.max(0, subtotal - discount + deliveryFee + taxesAndPacking);

    return {
      subtotal,
      totalItems,
      discount: Math.round(discount),
      deliveryFee,
      taxesAndPacking,
      grandTotal: Math.round(grandTotal),
    };
  };

  // Order Placement
  const checkoutOrder = (deliveryAddress, paymentMethod) => {
    const { grandTotal, totalItems } = calculateTotals();
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      itemsCount: totalItems,
      total: grandTotal,
      status: 'Processing',
      deliveryAddress: deliveryAddress || currentUser.address,
      paymentMethod: paymentMethod || 'Cash on Delivery (COD)',
      items: cart.map((i) => `${i.product.name} (x${i.quantity})`),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setAppliedCoupon(null);
    setCurrentUser((prev) => ({
      ...prev,
      ordersCount: (prev.ordersCount || 0) + 1,
    }));
    return newOrder;
  };

  // Admin Product Actions
  const adminAddProduct = (newProd) => {
    const id = `prod_${Date.now()}`;
    const product = {
      id,
      rating: 4.8,
      reviewsCount: 1,
      stock: parseInt(newProd.stock, 10) || 10,
      price: parseFloat(newProd.price) || 50,
      originalPrice: (parseFloat(newProd.price) || 50) * 1.25,
      discount: '20% OFF',
      ...newProd,
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`Added new product "${product.name}"!`, 'success');
    return product;
  };

  const adminUpdateProduct = (updatedProd) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? { ...p, ...updatedProd } : p))
    );
    showToast(`Updated "${updatedProd.name}" successfully!`, 'success');
  };

  const adminDeleteProduct = (productId) => {
    const target = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    setFavoriteIds((prev) => prev.filter((id) => id !== productId));
    showToast(`Deleted "${target?.name || 'Product'}" from store!`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        isAuthenticated,
        products,
        favoriteIds,
        cart,
        appliedCoupon,
        orders,
        toast,
        showToast,
        login,
        signup,
        logout,
        switchUserRole,
        updateUserProfile,
        toggleFavorite,
        isFavorite,
        getFavoriteProducts,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        addAllFavoritesToCart,
        applyCoupon,
        removeCoupon,
        calculateTotals,
        checkoutOrder,
        adminAddProduct,
        adminUpdateProduct,
        adminDeleteProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

