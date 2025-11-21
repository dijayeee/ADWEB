import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContext';
import api from '../config/axios';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user: authUser } = useAuth();
  const [hasAddress, setHasAddress] = useState(false);

  useEffect(() => {
    if (authUser) {
      checkUserAddress();
    }
  }, [authUser]);

  useEffect(() => {
    refreshProductStock();
  }, [cartItems]);

  const refreshProductStock = async () => {
    if (cartItems.length === 0) return;
    
    try {
      // Fetch latest product stock for items in cart
      for (const item of cartItems) {
        const productId = item._id || item.id;
        if (productId) {
          try {
            const response = await api.get(`/products/${productId}`);
            if (response.data.success && response.data.product) {
              const latestStock = response.data.product.stock;
              // If current quantity exceeds stock, adjust it
              if (item.quantity > latestStock) {
                updateQuantity(item.cartId || item.id, latestStock);
              }
            }
          } catch (err) {
            console.error(`Error fetching stock for product ${productId}:`, err);
          }
        }
      }
    } catch (err) {
      console.error('Error refreshing product stock:', err);
    }
  };

  const checkUserAddress = async () => {
    try {
      const response = await api.get(`/users/profile/${authUser?.username}`);
      if (response.data.success) {
        const addresses = response.data.user.addresses || [];
        setHasAddress(addresses.length > 0);
      }
    } catch (err) {
      console.error('Error checking addresses:', err);
      setHasAddress(false);
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!authUser) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    if (!hasAddress) {
      alert('Please add a delivery address first before proceeding to checkout.');
      navigate('/address');
      return;
    }
    navigate('/order');
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Add some items to get started!</p>
            <Link
              to="/home"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const itemId = item.cartId || item.id;
                return (
                  <div
                    key={itemId}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-4"
                  >
                    <div className="w-full md:w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-2">{item.category}</p>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      )}
                      {item.selectedColor && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-semibold">Color:</span> {item.selectedColor}
                        </p>
                      )}
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-semibold">Size:</span> {item.selectedSize}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mb-2">
                        <span className={`font-semibold ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.soldCount || 0} product sold
                        </span>
                        {item.stock > 0 && (
                          <span className="text-gray-500 ml-2">• {item.stock} available</span>
                        )}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">₱{item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          disabled={item.quantity >= (item.stock || 0)}
                          className="p-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₱{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">₱10.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">₱{(getCartTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      ₱{(getCartTotal() + 10 + getCartTotal() * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="block w-full bg-black text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={clearCart}
                    className="block w-full bg-gray-200 text-gray-900 text-center py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Clear Cart
                  </button>
                  <Link
                    to="/home"
                    className="block w-full text-center text-gray-600 hover:text-gray-900 transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Cart;

