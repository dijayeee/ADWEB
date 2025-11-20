import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductModal from './ProductModal';
import { useAuth } from '../Context/AuthContext';
import LoginRequiredModal from './LoginRequiredModal';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleProductClick = () => {
    navigate(`/product/${product._id || product.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
      <div 
        onClick={handleProductClick}
        className="relative h-64 bg-gray-200 overflow-hidden cursor-pointer"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 
          onClick={handleProductClick}
          className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-gray-700"
        >
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
        {product.description && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
        )}
        <div className="mb-2">
          <p className="text-sm text-gray-600">
            <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.soldCount || 0} product sold
            </span>
            {product.stock > 0 && (
              <span className="text-gray-500 ml-2">• {product.stock} available</span>
            )}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-gray-900">₱{product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            disabled={!product.stock || product.stock === 0}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="You need to log in first to add items to cart."
      />
    </div>
  );
}

export default ProductCard;

