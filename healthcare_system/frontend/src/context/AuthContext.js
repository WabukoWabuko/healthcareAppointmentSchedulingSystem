import { createContext, useState, useEffect } from 'react';
import api from '../api';  // Use the new Axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/api/auth/users/me/');
          setUser(res.data);
        } catch (error) {
          console.error('Error fetching user:', error);
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/jwt/create/', { email, password });
      const accessToken = res.data.access;
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      const userRes = await api.get('/api/auth/users/me/');
      setUser(userRes.data);
      return userRes.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
