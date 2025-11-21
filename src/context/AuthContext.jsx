import { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, getUserData, setAuthToken, setUserData, clearUserData } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = getAuthToken();
    const userData = getUserData();

    if (token && userData.phoneNumber && userData.role) {
      setUser({
        phoneNumber: userData.phoneNumber,
        role: userData.role,
      });
    }
    setLoading(false);
  }, []);

  const login = (token, phoneNumber, role) => {
    setAuthToken(token);
    setUserData(phoneNumber, role);
    setUser({ phoneNumber, role });
  };

  const logout = () => {
    clearUserData();
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isCustomer = () => {
    return user?.role === 'CUSTOMER';
  };

  const isProvider = () => {
    return user?.role === 'PROVIDER';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isCustomer,
        isProvider
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};