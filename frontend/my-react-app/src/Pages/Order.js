import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, CreditCard, Wallet, Banknote, MapPin, AlertCircle, Plus, Minus } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContext';
import api from '../config/axios';

function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const { user: authUser } = useAuth();
  const buyNowItem = location.state?.buyNowItem;
  const [orderComplete, setOrderComplete] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'cod', 'gcash', 'paymaya'
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  // Use buyNowItem if available, otherwise use cartItems
  const [orderItems, setOrderItems] = useState(buyNowItem ? [buyNowItem] : cartItems);

  // Update orderItems when cartItems or buyNowItem changes
  useEffect(() => {
    if (buyNowItem) {
      setOrderItems([buyNowItem]);
    } else {
      setOrderItems(cartItems);
    }
  }, [buyNowItem, cartItems]);

  // Refresh product stock from API
  const refreshProductStock = async () => {
    const currentItems = buyNowItem ? [buyNowItem] : cartItems;
    if (currentItems.length === 0) return;
    
    try {
      // Fetch latest product stock for items in order
      const stockUpdates = {};
      for (const item of currentItems) {
        const productId = item._id || item.id;
        if (productId && !stockUpdates[productId]) {
          try {
            const response = await api.get(`/products/${productId}`);
            if (response.data.success && response.data.product) {
              stockUpdates[productId] = response.data.product.stock;
            }
          } catch (err) {
            console.error(`Error fetching stock for product ${productId}:`, err);
          }
        }
      }
      
      // Update all items with latest stock in one batch
      setOrderItems(prevItems => prevItems.map(item => {
        const productId = item._id || item.id;
        if (productId && stockUpdates[productId] !== undefined) {
          const latestStock = stockUpdates[productId];
          // If current quantity exceeds stock, adjust it
          if (item.quantity > latestStock) {
            return { ...item, stock: latestStock, quantity: latestStock };
          }
          return { ...item, stock: latestStock };
        }
        return item;
      }));
    } catch (err) {
      console.error('Error refreshing product stock:', err);
    }
  };

  // Refresh stock when orderItems are first loaded
  useEffect(() => {
    if (orderItems.length > 0) {
      refreshProductStock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyNowItem ? buyNowItem.cartId : null, cartItems.length]); // Only refresh when items change, not on every render

  // Update quantity for order items
  const updateOrderItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item from order
      setOrderItems(prevItems => prevItems.filter(item => {
        const itemUniqueId = item.cartId || item.id;
        return itemUniqueId !== itemId;
      }));
      // If not buy now, also remove from cart
      if (!buyNowItem) {
        removeFromCart(itemId);
      }
      return;
    }

    setOrderItems(prevItems => prevItems.map(item => {
      const itemUniqueId = item.cartId || item.id;
      if (itemUniqueId === itemId) {
        // Check stock availability
        const availableStock = item.stock || 0;
        if (newQuantity > availableStock) {
          alert(`Only ${availableStock} items available in stock`);
          return item; // Return unchanged item
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));

    // If not buy now, also update cart
    if (!buyNowItem) {
      updateQuantity(itemId, newQuantity);
    }
  };

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }
    fetchUserAddresses();
  }, [authUser]);

  const fetchUserAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/profile/${authUser?.username}`);
      if (response.data.success) {
        const userAddresses = response.data.user.addresses || [];
        setAddresses(userAddresses);
        
        // Set default address if available
        const defaultAddress = userAddresses.find(addr => addr.isDefault) || userAddresses[0];
        setSelectedAddress(defaultAddress);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure a shipping address is selected before proceeding
    if (!selectedAddress) {
      alert('Please add or select a delivery address before placing your order.');
      return;
    }
    
    // Validate payment method specific fields
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        alert('Please fill in all card details');
        return;
      }
    }

    try {
      setLoading(true);

      // Validate stock before placing order
      for (const item of orderItems) {
        const availableStock = item.stock || 0;
        const requestedQuantity = item.quantity || 1;
        if (requestedQuantity > availableStock) {
          alert(`${item.name}: Only ${availableStock} items available in stock. Please adjust your quantity.`);
          setLoading(false);
          return;
        }
        if (availableStock === 0) {
          alert(`${item.name} is out of stock. Please remove it from your order.`);
          setLoading(false);
          return;
        }
      }

      // Prepare order data
      const orderData = {
        user: {
          username: authUser.username,
          email: authUser.email,
          firstName: authUser.firstName,
          lastName: authUser.lastName
        },
        items: orderItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image || '',
          category: item.category || '',
          selectedColor: item.selectedColor || '',
          selectedSize: item.selectedSize || '',
          productId: item._id || item.id || ''
        })),
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total
      };

      // Save order to backend
      const response = await api.post('/orders', orderData);

      if (response.data.success) {
        setOrderComplete(true);
        // Only clear cart if it's not a buy now order
        if (!buyNowItem) {
          clearCart();
        }
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If no addresses, show message to add address first
  if (!loading && addresses.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-12 rounded-lg shadow-lg max-w-md">
            <AlertCircle className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Address Required</h1>
            <p className="text-gray-600 mb-6">
              You need to add a delivery address before you can proceed with checkout.
            </p>
            <button
              onClick={() => navigate('/address')}
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition mb-3"
            >
              Add Address
            </button>
            <br />
            <button
              onClick={() => navigate('/cart')}
              className="inline-block text-gray-600 hover:text-gray-900 transition"
            >
              Back to Cart
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (orderItems.length === 0 && !orderComplete) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">No Items to Checkout</h1>
            <p className="text-gray-600 mb-6">Add some items to your cart first!</p>
            <button
              onClick={() => navigate('/home')}
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (orderComplete) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-12 rounded-lg shadow-lg max-w-md">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            </p>
            <button
              onClick={() => navigate('/home')}
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate totals based on order items
  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Information - Only show if address exists */}
                {selectedAddress && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin className="h-6 w-6 text-gray-900" />
                      <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded">
                          {selectedAddress.label}
                        </span>
                        {selectedAddress.isDefault && (
                          <span className="px-2 py-1 bg-black text-white text-xs font-semibold rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">{selectedAddress.fullName}</p>
                      <p className="text-sm text-gray-600 mb-1">{selectedAddress.phoneNumber}</p>
                      <p className="text-sm text-gray-600 mb-1">{selectedAddress.streetName}</p>
                      <p className="text-sm text-gray-600">
                        {selectedAddress.region}, {selectedAddress.postalCode}
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/address')}
                        className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Change Address
                      </button>
                    </div>
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="h-6 w-6 text-gray-900" />
                    <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {/* Card Payment */}
                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-black focus:ring-black"
                      />
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Credit/Debit Card</span>
                    </label>

                    {/* Cash on Delivery */}
                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-black focus:ring-black"
                      />
                      <Banknote className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Cash on Delivery</span>
                    </label>

                    {/* GCash */}
                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="gcash"
                        checked={paymentMethod === 'gcash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-black focus:ring-black"
                      />
                      <Wallet className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">GCash</span>
                    </label>

                    {/* PayMaya */}
                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paymaya"
                        checked={paymentMethod === 'paymaya'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-black focus:ring-black"
                      />
                      <Wallet className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">PayMaya</span>
                    </label>
                  </div>

                  {/* Card Details - Only show if Card is selected */}
                  {paymentMethod === 'card' && (
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Details</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          required
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          required
                          value={formData.cardName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            required
                            placeholder="MM/YY"
                            maxLength="5"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            required
                            placeholder="123"
                            maxLength="3"
                            value={formData.cvv}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Method Info */}
                  {paymentMethod === 'cod' && (
                    <div className="border-t pt-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Cash on Delivery:</strong> You will pay in cash when your order is delivered.
                        </p>
                      </div>
                    </div>
                  )}

                  {(paymentMethod === 'gcash' || paymentMethod === 'paymaya') && (
                    <div className="border-t pt-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>{paymentMethod === 'gcash' ? 'GCash' : 'PayMaya'}:</strong> You will be redirected to complete your payment.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    {orderItems.map((item) => {
                      const itemId = item.cartId || item.id;
                      const quantity = item.quantity || 1;
                      const availableStock = item.stock || 0;
                      return (
                        <div key={itemId} className="border-b pb-4 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-semibold">{item.name}</p>
                              {item.description && (
                                <p className="text-xs text-gray-500 mb-1">{item.description}</p>
                              )}
                              {item.selectedColor && (
                                <p className="text-xs text-gray-600">Color: {item.selectedColor}</p>
                              )}
                              {item.selectedSize && (
                                <p className="text-xs text-gray-600">Size: {item.selectedSize}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                <span className={`font-semibold ${availableStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {item.soldCount || 0} product sold
                                </span>
                                {availableStock > 0 && (
                                  <span className="text-gray-500 ml-1">• {availableStock} available</span>
                                )}
                              </p>
                            </div>
                            <p className="font-semibold">${(item.price * quantity).toFixed(2)}</p>
                          </div>
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => updateOrderItemQuantity(itemId, quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded transition"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-1 font-semibold border border-gray-300 rounded min-w-[3rem] text-center">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateOrderItemQuantity(itemId, quantity + 1)}
                              disabled={quantity >= availableStock}
                              className="p-1 hover:bg-gray-100 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t pt-4 space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Order;
