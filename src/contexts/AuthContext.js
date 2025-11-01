import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

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
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verify token on app load
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/verify');
          setUser(response.data.user);
        } catch (error) {
          console.error('Token verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (credentials, userType) => {
    try {
      setLoading(true);
      const endpoint = userType === 'admin' ? '/api/auth/login/admin' : 
                      userType === 'owner' ? '/api/auth/login/owner' : 
                      '/api/auth/login/tenant';
      
      const response = await axios.post(endpoint, credentials);
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      toast.success('Login successful!');
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // role can be 'owner' | 'tenant' | 'admin'
  const register = async (userData, role = 'owner') => {
    try {
      setLoading(true);
      let response;
      if (role === 'tenant') {
        response = await authAPI.registerTenant(userData);
      } else if (role === 'admin') {
        response = await authAPI.registerAdmin(userData);
      } else {
        response = await authAPI.registerOwner(userData);
      }

      toast.success('Registration successful! Please wait for admin approval.');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      toast.success('Logged out successfully');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isOwner: user?.role === 'owner',
    isTenant: user?.role === 'tenant',
    isAdmin: user?.role === 'admin',
    isVerified: user?.verificationStatus === 'approved'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
