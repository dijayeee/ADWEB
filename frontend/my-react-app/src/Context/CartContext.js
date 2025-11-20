import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // Load cart from localStorage on mount. Priority:
  // 1. generic 'cartItems' key (anonymous or last session)
  // 2. user-specific 'cartItems_user_<username>' if exists and no generic cart
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
        return;
      }

      if (user && user.username) {
        const userKey = `cartItems_user_${user.username}`;
        const userCart = localStorage.getItem(userKey);
        if (userCart) {
          setCartItems(JSON.parse(userCart));
          // also mirror into generic key
          localStorage.setItem('cartItems', userCart);
        }
      }
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save cart to localStorage whenever it changes. Also persist a user-specific copy when logged in.
  useEffect(() => {
    try {
      const data = JSON.stringify(cartItems);
      localStorage.setItem('cartItems', data);
      if (user && user.username) {
        const userKey = `cartItems_user_${user.username}`;
        localStorage.setItem(userKey, data);
      }
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, [cartItems, user]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Use cartId if available (includes color and size), otherwise use id
      const uniqueId = product.cartId || product.id;
      const existingItem = prevItems.find((item) => {
        const itemUniqueId = item.cartId || item.id;
        return itemUniqueId === uniqueId;
      });
      
      if (existingItem) {
        // Check if adding one more would exceed stock
        const newQuantity = existingItem.quantity + 1;
        const availableStock = product.stock || 0;
        if (newQuantity > availableStock) {
          alert(`Only ${availableStock} items available in stock`);
          return prevItems;
        }
        return prevItems.map((item) => {
          const itemUniqueId = item.cartId || item.id;
          return itemUniqueId === uniqueId
            ? { ...item, quantity: newQuantity }
            : item;
        });
      } else {
        // Check stock before adding new item
        const availableStock = product.stock || 0;
        if (availableStock <= 0) {
          alert('This product is out of stock');
          return prevItems;
        }
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => {
        const itemUniqueId = item.cartId || item.id;
        return itemUniqueId !== cartItemId;
      })
    );
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const itemUniqueId = item.cartId || item.id;
        if (itemUniqueId === cartItemId) {
          // Check stock availability
          const availableStock = item.stock || 0;
          if (quantity > availableStock) {
            alert(`Only ${availableStock} items available in stock`);
            return item; // Return unchanged item
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('cartItems');
      if (user && user.username) {
        localStorage.removeItem(`cartItems_user_${user.username}`);
      }
    } catch (err) {
      console.error('Error clearing cart from localStorage:', err);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

