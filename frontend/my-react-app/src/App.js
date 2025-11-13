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
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
