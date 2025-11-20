<<<<<<< HEAD
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import BookList from './pages/BookList';
import AdminPanel from './pages/AdminPanel';
import ManageAdmins from './pages/ManageAdmins';
import './App.css';

function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);
  if (loading) return <p>Loading...</p>;
  return token ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { token, user, logout } = useContext(AuthContext);

  return (
    <>
      {token && (
        <nav style={{ background: '#333', padding: '1rem', color: 'white' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>📚 Library System</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {user && <span>Welcome, {user.name}! ({user.role})</span>}
              {user?.role === 'admin' && (
                <a href="/manage-admins" style={{ marginLeft: '1rem', padding: '0.5rem 0.75rem', background: '#28a745', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
                  Manage Admins
                </a>
              )}
              <button onClick={logout} style={{ marginLeft: '1rem', padding: '0.5rem 1rem', background: '#667eea', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <BookList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-admins"
          element={
            <ProtectedRoute>
              <ManageAdmins />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={token ? '/books' : '/login'} />} />
      </Routes>
    </>
  );
=======
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './Context/CartContext';
import { AuthProvider, useAuth } from './Context/AuthContext';
import HomePage from './HomePage';
import Login from './Login';
import SignUp from './Pages/SignUp';
import WomenShop from './Pages/WomenShop';
import MenShop from './Pages/MenShop';
import KidsShop from './Pages/KidsShop';
import BabyShop from './Pages/BabyShop';
import Cart from './Pages/Cart';
import Order from './Pages/Order';
import Profile from './Pages/Profile';
import Address from './Pages/Address';
import ChangePassword from './Pages/ChangePassword';
import MyPurchase from './Pages/MyPurchase';
import Admin from './Pages/Admin';
import SearchResults from './Pages/SearchResults';
import ProductDetail from './Pages/ProductDetail';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  const isAdmin = user?.username === 'admin';
  return isAdmin ? children : <Navigate to="/login" replace />;
>>>>>>> 9676373 (Initial commit)
}

function App() {
  return (
<<<<<<< HEAD
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
=======
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
          <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/women" element={<WomenShop />} />
            <Route path="/men" element={<MenShop />} />
            <Route path="/kids" element={<KidsShop />} />
            <Route path="/baby" element={<BabyShop />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/address"
              element={
                <PrivateRoute>
                  <Address />
                </PrivateRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <PrivateRoute>
                  <ChangePassword />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-purchase"
              element={
                <PrivateRoute>
                  <MyPurchase />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
>>>>>>> 9676373 (Initial commit)
  );
}

export default App;
