import { ShoppingCart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AddedToCartModal({ isOpen, productName, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleContinueShopping = () => {
    onClose();
  };

  const handleGoToCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Added to Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          <span className="font-semibold">{productName}</span> has been successfully added to your cart.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleContinueShopping}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleGoToCart}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Go to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddedToCartModal;
