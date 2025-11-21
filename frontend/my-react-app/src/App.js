import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './Context/CartContext';
import { AuthProvider, useAuth } from './Context/AuthContext';
import HomePage from './HomePage';
import Login from './Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import WomenShop from './pages/WomenShop';
import MenShop from './pages/MenShop';
import KidsShop from './pages/KidsShop';
import BabyShop from './pages/BabyShop';
import Cart from './pages/Cart';
import Order from './pages/Order';
import Profile from './pages/Profile';
import Address from './pages/Address';
import ChangePassword from './pages/ChangePassword';
import MyPurchase from './pages/MyPurchase';
import Admin from './pages/Admin';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  const isAdmin = user?.username === 'admin';
  return isAdmin ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
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
  );
}

export default App;
