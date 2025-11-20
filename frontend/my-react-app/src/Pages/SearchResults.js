import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ProductCard from '../Components/ProductCard';
import products from '../data/products';

function SearchResults() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = (params.get('q') || '').trim();
  const normalizedQuery = query.toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return products.filter((product) => {
      const searchableFields = [
        product.name,
        product.category,
        ...(product.colors || []),
        ...(product.sizes || [])
      ]
        .filter(Boolean)
        .map((field) => field.toString().toLowerCase());

      return searchableFields.some((field) =>
        field.includes(normalizedQuery)
      );
    });
  }, [normalizedQuery]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {query ? `Search results for "${query}"` : 'Search'}
            </h1>
            {query && (
              <span className="text-sm text-gray-500">
                {results.length} {results.length === 1 ? 'item' : 'items'} found
              </span>
            )}
          </div>

          {!query && (
            <div className="mt-12 bg-white border border-gray-200 rounded-lg p-6 text-gray-600">
              Start typing in the search bar to find products and categories.
            </div>
          )}

          {query && results.length === 0 && (
            <div className="mt-12 bg-white border border-gray-200 rounded-lg p-6 text-gray-600">
              <p className="font-semibold text-gray-900 mb-2">
                No products matched your search.
              </p>
              <p>
                Try searching for terms like <strong>Women</strong>,{' '}
                <strong>Men</strong>, <strong>Kids</strong>,{' '}
                <strong>Baby</strong>, or specific product names such as{' '}
                <strong>Classic Suit</strong>.
              </p>
            </div>
          )}

          {query && results.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SearchResults;






