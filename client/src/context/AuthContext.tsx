import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/user/dashboard')
      .then(response => {
        setUser(response.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Compute a slogan based on authentication state
  const slogan = user
    ? `Welcome, ${user.name}! Ready to play?`
    : "Welcome to our Game Site! Please log in.";

  return (
    <AuthContext.Provider value={{ user, setUser, loading, slogan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);