import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContext';
import LoginRequiredModal from './LoginRequiredModal';
import products from '../data/products';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const location = useLocation();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const dropdownRef = useRef(null);

  const CATEGORY_ROUTES = useMemo(
    () => ({
      Women: '/women',
      Men: '/men',
      Kids: '/kids',
      Baby: '/baby'
    }),
    []
  );

  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      const query = params.get('q') || '';
      setSearchTerm(query);
    }
  }, [location.pathname, location.search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const updateSuggestions = (value) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      setSuggestions([]);
      setHighlightedIndex(-1);
      return;
    }

    const lowerValue = trimmedValue.toLowerCase();
    const categoryMatches = Object.keys(CATEGORY_ROUTES)
      .filter((category) => category.toLowerCase().includes(lowerValue))
      .map((category) => ({
        id: `category-${category.toLowerCase()}`,
        label: `${category} Collection`,
        category,
        type: 'category'
      }));

    const nameMatches = [];
    const seenNames = new Set();

    products.forEach((product) => {
      if (
        (product.name && product.name.toLowerCase().includes(lowerValue)) ||
        (product.category && product.category.toLowerCase().includes(lowerValue))
      ) {
        if (!seenNames.has(product.name)) {
          seenNames.add(product.name);
          nameMatches.push({
            id: product.id,
            label: product.name,
            category: product.category,
            type: 'product'
          });
        }
      }
    });

    const combined = [...categoryMatches, ...nameMatches].slice(0, 8);
    setSuggestions(combined);
    setHighlightedIndex(combined.length > 0 ? 0 : -1);
  };

  const handleSearchNavigation = (value) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return;
    }

    const categoryMatch = Object.keys(CATEGORY_ROUTES).find(
      (category) =>
        category.toLowerCase() === trimmedValue.toLowerCase() ||
        `${category.toLowerCase()} collection` === trimmedValue.toLowerCase()
    );

    if (categoryMatch) {
      navigate(CATEGORY_ROUTES[categoryMatch]);
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmedValue)}`);
    }

    setIsSearchFocused(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
    setIsMobileMenuOpen(false);
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(
      suggestion.type === 'category' ? suggestion.category : suggestion.label
    );
    handleSearchNavigation(
      suggestion.type === 'category' ? suggestion.category : suggestion.label
    );
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    handleSearchNavigation(searchTerm);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    updateSuggestions(value);
    setIsSearchFocused(true);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchTerm.trim()) {
      updateSuggestions(searchTerm);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
      setHighlightedIndex(-1);
    }, 120);
  };

  const handleSearchKeyDown = (event) => {
    if (!suggestions.length) {
      if (event.key === 'Enter') {
        handleSearchNavigation(searchTerm);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev + 1 >= suggestions.length ? 0 : prev + 1
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev - 1 < 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (highlightedIndex >= 0) {
        handleSuggestionSelect(suggestions[highlightedIndex]);
      } else {
        handleSearchNavigation(searchTerm);
      }
    } else if (event.key === 'Escape') {
      setIsSearchFocused(false);
      setSuggestions([]);
      setHighlightedIndex(-1);
    }
  };

  const renderSearchBar = (wrapperClassName) => (
    <div className={wrapperClassName}>
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search products or categories..."
          autoComplete="off"
          className="w-full pl-4 pr-12 py-2 bg-white rounded-md focus:outline-none text-gray-900 placeholder-gray-400 shadow-sm"
          aria-label="Search products"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-black text-white hover:bg-gray-800 transition"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        {isSearchFocused && suggestions.length > 0 && (
          <ul
            className="absolute left-0 right-0 mt-2 rounded-md border border-gray-200 bg-white shadow-xl z-50 max-h-64 overflow-auto"
            role="listbox"
            aria-label="Search suggestions"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                role="option"
                aria-selected={highlightedIndex === index}
                className={`px-4 py-2 cursor-pointer text-sm transition ${
                  highlightedIndex === index
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSuggestionSelect(suggestion);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="font-medium">{suggestion.label}</span>
                <span className="block text-xs text-gray-500">
                  {suggestion.type === 'category'
                    ? 'Category'
                    : `${suggestion.category} Collection`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );

  return (
    <header className="bg-black sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/home" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white  tracking-wide">WearHaus</h1>
            </Link>

            {/* Search Bar - Center */}
            {renderSearchBar('hidden md:flex items-center flex-1 max-w-md mx-8')}

            {/* Icons - Right */}
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative p-2 hover:opacity-80 transition">
                <ShoppingCart className="h-6 w-6 text-white" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {getCartItemCount()}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="p-2 hover:opacity-80 transition flex items-center gap-1"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    aria-label="User menu"
                    title="User menu"
                  >
                    <User className="h-6 w-6 text-white" />
                    <ChevronDown className="h-4 w-4 text-white" />
                  </button>
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{user?.username || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || ''}</p>
                      </div>
                      <div className="py-1">
                        <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">My Account</p>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/address"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Address
                        </Link>
                        <Link
                          to="/change-password"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Change Password
                        </Link>
                      </div>
                      <div className="py-1 border-t border-gray-200">
                        <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">My Purchase</p>
                        <Link
                          to="/my-purchase"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          My Orders
                        </Link>
                      </div>
                      <div className="py-1 border-t border-gray-200">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserDropdown(false);
                            navigate('/login', { replace: true });
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="p-2 hover:opacity-80 transition"
                  onClick={() => setShowLoginModal(true)}
                  aria-label="Login"
                  title="Login"
                >
                  <User className="h-6 w-6 text-white" />
                </button>
              )}

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-white p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex space-x-8 h-12 items-center">
            <Link 
              to="/home" 
              className={`text-white font-medium transition pb-1 ${
                location.pathname === '/home' ? 'border-b-2 border-white' : 'hover:opacity-80'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/women" 
              className={`text-white font-medium transition pb-1 ${
                location.pathname === '/women' ? 'border-b-2 border-white' : 'hover:opacity-80'
              }`}
            >
              Women
            </Link>
            <Link 
              to="/men" 
              className={`text-white font-medium transition pb-1 ${
                location.pathname === '/men' ? 'border-b-2 border-white' : 'hover:opacity-80'
              }`}
            >
              Men
            </Link>
            <Link 
              to="/kids" 
              className={`text-white font-medium transition pb-1 ${
                location.pathname === '/kids' ? 'border-b-2 border-white' : 'hover:opacity-80'
              }`}
            >
              Kids
            </Link>
            <Link 
              to="/baby" 
              className={`text-white font-medium transition pb-1 ${
                location.pathname === '/baby' ? 'border-b-2 border-white' : 'hover:opacity-80'
              }`}
            >
              Baby
            </Link>
          </nav>

          {/* Mobile Search */}
          {renderSearchBar('md:hidden pb-3')}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-2 pt-4">
              <Link 
                to="/home" 
                className={`block px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition ${
                  location.pathname === '/home' ? 'border-b-2 border-white w-fit' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/women" 
                className={`block px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition ${
                  location.pathname === '/women' ? 'border-b-2 border-white w-fit' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Women
              </Link>
              <Link 
                to="/men" 
                className={`block px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition ${
                  location.pathname === '/men' ? 'border-b-2 border-white w-fit' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Men
              </Link>
              <Link 
                to="/kids" 
                className={`block px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition ${
                  location.pathname === '/kids' ? 'border-b-2 border-white w-fit' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kids
              </Link>
              <Link 
                to="/baby" 
                className={`block px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition ${
                  location.pathname === '/baby' ? 'border-b-2 border-white w-fit' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Baby
              </Link>
            </nav>
          )}
        </div>
      </div>
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="You need to log in first to view your profile."
      />
    </header>
  );
}

export default Header;