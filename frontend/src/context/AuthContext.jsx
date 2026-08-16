import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { setLogoutCallback } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('cf_access_token') || null);
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('cf_refresh_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cf_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Helper to extract username from token or store username
  const processTokenAndUser = (token, usernameAttempt) => {
    let username = usernameAttempt;
    try {
      const decoded = jwtDecode(token);
      if (decoded.username) {
        username = decoded.username;
      } else if (decoded.user_id) {
        username = usernameAttempt || `User #${decoded.user_id}`;
      }
    } catch (e) {
      console.warn('Could not decode JWT:', e);
    }
    const userData = { username: username || usernameAttempt || 'User' };
    setUser(userData);
    localStorage.setItem('cf_user', JSON.stringify(userData));
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('cf_access_token');
    localStorage.removeItem('cf_refresh_token');
    localStorage.removeItem('cf_user');
  };

  useEffect(() => {
    // Register global logout callback for Axios interceptor 401 failures
    setLogoutCallback(logout);

    // Initial auth verification
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          // Token expired, logout or let refresh handler execute when API called
        }
      } catch (e) {
        // Invalid token
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('https://jat-backend-5f2n.onrender.com/api/auth/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;
      setAccessToken(access);
      setRefreshToken(refresh);
      localStorage.setItem('cf_access_token', access);
      localStorage.setItem('cf_refresh_token', refresh);

      processTokenAndUser(access, username);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Invalid username or password';
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
