import { useState, useEffect } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import api from '../config/axios';
import AddedToCartModal from './AddedToCartModal';

function ProductModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [hasAddress, setHasAddress] = useState(false);
  const [checkingAddress, setCheckingAddress] = useState(true);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const productId = product._id || product.id;
  const colors = Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : [];
  const sizes = Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : [];
  const [selectedColor, setSelectedColor] = useState(colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');

  useEffect(() => {
    if (isOpen && authUser) {
      checkUserAddress();
    }
  }, [isOpen, authUser]);

  const checkUserAddress = async () => {
    try {
      setCheckingAddress(true);
      const response = await api.get(`/users/profile/${authUser?.username}`);
      if (response.data.success) {
        const addresses = response.data.user.addresses || [];
        setHasAddress(addresses.length > 0);
      }
    } catch (err) {
      console.error('Error checking addresses:', err);
      setHasAddress(false);
    } finally {
      setCheckingAddress(false);
    }
  };

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (!authUser) {
      alert('Please login first');
      navigate('/login');
      return;
    }


    if (!product.stock || product.stock === 0) {
      alert('This product is out of stock');
      return;
    }

    if (colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    const productWithOptions = {
      ...product,
      selectedColor: selectedColor || 'N/A',
      selectedSize: selectedSize || 'N/A',
      // Create unique ID that includes color and size to allow same product with different options
      cartId: `${productId}-${selectedColor || 'N/A'}-${selectedSize || 'N/A'}`,
    };

    addToCart(productWithOptions);
    setShowAddedModal(true);
  };

  const handleBuyNow = () => {
    if (!authUser) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    if (!hasAddress) {
      alert('Please add a delivery address first before purchasing.');
      onClose();
      navigate('/address');
      return;
    }

    if (!product.stock || product.stock === 0) {
      alert('This product is out of stock');
      return;
    }

    if (colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    const productWithOptions = {
      ...product,
      selectedColor: selectedColor || 'N/A',
      selectedSize: selectedSize || 'N/A',
      cartId: `${productId}-${selectedColor || 'N/A'}-${selectedSize || 'N/A'}`,
      quantity: 1
    };

    // Don't add to cart - pass directly to order page via state
    onClose();
    navigate('/order', { state: { buyNowItem: productWithOptions } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Select Options</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Product Image */}
          <div className="mb-6">
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-4">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{product.category}</p>
            {product.description && (
              <p className="text-gray-700 mb-3 text-sm">{product.description}</p>
            )}
            <p className="text-xl font-semibold text-gray-900">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-2">
              <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.soldCount || 0} product sold
              </span>
              {product.stock > 0 && (
                <span className="text-gray-500 ml-2">• {product.stock} available</span>
              )}
            </p>
          </div>

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Color <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="mt-2 text-sm text-gray-600">Selected: <span className="font-semibold">{selectedColor}</span></p>
              )}
            </div>
          )}

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Size <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 font-semibold transition ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="mt-2 text-sm text-gray-600">Selected: <span className="font-semibold">{selectedSize}</span></p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={(colors.length > 0 && !selectedColor) || (sizes.length > 0 && !selectedSize) || !product.stock || product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-5 w-5" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={(colors.length > 0 && !selectedColor) || (sizes.length > 0 && !selectedSize) || !product.stock || product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black border border-black py-3 rounded-lg font-semibold hover:bg-gray-100 transition disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed"
            >
              {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
      <AddedToCartModal
        isOpen={showAddedModal}
        productName={product.name}
        onClose={() => {
          setShowAddedModal(false);
          onClose();
        }}
      />
    </div>
  );
}

export default ProductModal;

