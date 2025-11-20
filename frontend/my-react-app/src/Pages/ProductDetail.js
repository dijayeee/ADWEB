import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ProductCard from '../Components/ProductCard';
import { useCart } from '../Context/CartContext';
import api from '../config/axios';
import localProducts from '../data/products';
import AddedToCartModal from '../Components/AddedToCartModal';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showAddedModal, setShowAddedModal] = useState(false);

  const fetchRelatedProducts = useCallback(async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      if (response.data.success) {
        // Enrich with local descriptions and filter out current product
        const enriched = response.data.products
          .filter(p => p._id !== id)
          .map(backendProduct => {
            const localProduct = localProducts.find(p => 
              p.name.toLowerCase() === backendProduct.name.toLowerCase()
            );
            return {
              ...backendProduct,
              description: backendProduct.description || localProduct?.description || ''
            };
          })
          .slice(0, 4); // Show only 4 related products
        
        setRelatedProducts(enriched);
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  }, [id]);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        let product = response.data.product;

        // Enrich with description from local data if not present
        if (!product.description) {
          const localProduct = localProducts.find(p => 
            p.name.toLowerCase() === product.name.toLowerCase()
          );
          if (localProduct) {
            product.description = localProduct.description;
          }
        }

        setProduct(product);

        // Set default selections
        if (product.colors && product.colors.length > 0) {
          setSelectedColor(product.colors[0]);
        }
        if (product.sizes && product.sizes.length > 0) {
          setSelectedSize(product.sizes[0]);
        }

        // Fetch related products (same category)
        fetchRelatedProducts(product.category);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.response?.data?.error || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id, fetchRelatedProducts]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);


  const handleAddToCart = () => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    const cartItem = {
      ...product,
      quantity,
      selectedColor: selectedColor || 'N/A',
      selectedSize: selectedSize || 'N/A',
      cartId: `${product._id || product.id}-${selectedColor || 'N/A'}-${selectedSize || 'N/A'}`
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem);
    }
    
    setShowAddedModal(true);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Loading product...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
            <button
              onClick={() => navigate('/home')}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
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
        {/* Breadcrumb / Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>

        {/* Product Detail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-8">
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                <p className="text-3xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</p>

                {/* Description */}
                {product.description && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Description</h3>
                    <p className="text-gray-700 mb-4">{product.description}</p>
                  </div>
                )}

                {/* Features (optional - could be extended) */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Premium quality material</li>
                    <li>• Comfortable fit</li>
                    <li>• Durable and long-lasting</li>
                  </ul>
                </div>

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Color <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
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
                  </div>
                )}

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Size <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                            selectedSize === size
                              ? 'border-black bg-black text-white'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-6 py-2 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock || 100, quantity + 1))}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.soldCount || 0} product sold
                      </span>
                      {product.stock > 0 && (
                        <span className="text-gray-500 ml-2">• {product.stock} available</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => navigate('/order')}
                    className="flex-1 bg-white text-black border-2 border-black py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct._id || relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <AddedToCartModal
        isOpen={showAddedModal}
        productName={product?.name || 'Product'}
        onClose={() => setShowAddedModal(false)}
      />
    </>
  );
}

export default ProductDetail;
