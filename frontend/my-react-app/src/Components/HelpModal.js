import { useState } from 'react';
import { X } from 'lucide-react';

function HelpModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('account');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b bg-gray-50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 px-4 py-3 font-semibold border-b-2 transition ${
                activeTab === 'account'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveTab('shopping')}
              className={`flex-1 px-4 py-3 font-semibold border-b-2 transition ${
                activeTab === 'shopping'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Shopping
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`flex-1 px-4 py-3 font-semibold border-b-2 transition ${
                activeTab === 'shipping'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Shipping
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">How do I create an account?</h3>
                <p className="text-gray-700">
                  Click on the "Sign Up" button in the login page. Fill in your information including username, email, password, first name, last name, and phone number. Your account will be created immediately.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">How do I reset my password?</h3>
                <p className="text-gray-700">
                  After logging in, go to your Profile page and click "Change Password". Enter your current password and your new password. Make sure your new password is strong and unique.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">How do I update my profile?</h3>
                <p className="text-gray-700">
                  Click on your profile icon in the header and select "Profile". You can update your personal information, email, and phone number from there.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">How do I add a delivery address?</h3>
                <p className="text-gray-700">
                  Go to your profile and click "Address". Click "Add New Address" and fill in your complete address details. You can add multiple addresses and set one as default for faster checkout.
                </p>
              </div>
            </div>
          )}

          {/* Shopping Tab */}
          {activeTab === 'shopping' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">How do I add items to my cart?</h3>
                <p className="text-gray-700">
                  Browse products from the category pages or use the search function. Click on a product to view details. Select your preferred color and size, then click "Add to Cart". Your cart items persist even after logging out.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Can I modify items in my cart?</h3>
                <p className="text-gray-700">
                  Yes! Go to your cart page. You can increase/decrease quantities, remove items, or clear your entire cart. You can also view the order summary with subtotal, shipping, and tax calculations.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">What payment methods are available?</h3>
                <p className="text-gray-700">
                  We accept Credit/Debit Cards, Cash on Delivery (COD), GCash, and PayMaya. Choose your preferred payment method during checkout.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">How do I place an order?</h3>
                <p className="text-gray-700">
                  Add items to your cart, proceed to checkout, ensure you have a delivery address on file, select your payment method, and confirm your order. You'll receive a confirmation message.
                </p>
              </div>
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">What is the shipping cost?</h3>
                <p className="text-gray-700">
                  Shipping is a flat rate of $10.00 for all orders, regardless of order size or location. Tax will be calculated as 10% of your subtotal.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Is a delivery address required?</h3>
                <p className="text-gray-700">
                  Yes, a valid delivery address is required to proceed with checkout. You must add at least one address to your profile before placing an order.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Can I change my delivery address?</h3>
                <p className="text-gray-700">
                  During checkout, you can select from any of your saved addresses. Click "Change Address" to switch to a different address before finalizing your order.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">How do I track my order?</h3>
                <p className="text-gray-700">
                  Go to "My Orders" from your profile menu to view all your orders and their current status. Orders are typically processed and shipped within 1-2 business days.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">What if I want to buy immediately without a cart?</h3>
                <p className="text-gray-700">
                  Click "Buy Now" on any product detail page to proceed directly to checkout with just that item. You'll still need a delivery address on file to complete the purchase.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
