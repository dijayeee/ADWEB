import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Do not persist sessions; ensure any old persisted user is cleared on load
  useEffect(() => {
    localStorage.removeItem('user');
  }, []);

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      const response = await api.post('/users/login', {
        username,
        password
      });

      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        return { success: true, user: userData };
      } else {
        return { success: false, error: response.data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setIsLoading(true);
      const response = await api.post('/users/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        gender: userData.gender || 'Male',
        profileImage: userData.profileImage || ''
      });

      if (response.data.success) {
        const newUser = response.data.user;
        setUser(newUser);
        return { success: true, user: newUser };
      } else {
        return { success: false, error: response.data.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Signup failed. Please try again.';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

