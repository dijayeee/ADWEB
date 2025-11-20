import { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ProductCard from '../Components/ProductCard';
import api from '../config/axios';
import localProducts from '../data/products';

function WomenShop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/products/category/Women');
      if (response.data.success) {
        // Merge backend products with local product descriptions
        const enrichedProducts = response.data.products.map(backendProduct => {
          const localProduct = localProducts.find(p => 
            p.name.toLowerCase() === backendProduct.name.toLowerCase()
          );
          return {
            ...backendProduct,
            description: backendProduct.description || localProduct?.description || ''
          };
        });
        setProducts(enrichedProducts);
      } else {
        setError(response.data.error || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      } else {
        setError(err.response?.data?.error || err.message || 'Error fetching products. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Women's Collection</h1>
          {loading && <p className="text-gray-600">Loading products...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.length === 0 ? (
                <p className="text-gray-600 col-span-full">No products available in this category.</p>
              ) : (
                products.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default WomenShop;
