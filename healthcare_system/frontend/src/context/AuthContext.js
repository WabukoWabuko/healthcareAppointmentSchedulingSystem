import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.get('http://127.0.0.1:8000/api/auth/users/me/', {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then(res => {
          console.log('User data:', res.data);
          setUser(res.data);
        })
        .catch(err => {
          console.error('Error fetching user:', err);
          setToken(null);
          localStorage.removeItem('token');
        });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/jwt/create/', { email, password });
      const { access } = res.data;
      setToken(access);
      localStorage.setItem('token', access);
      const userRes = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', {
        headers: { Authorization: `Bearer ${access}` },
      });
      setUser(userRes.data);
      return userRes.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.detail || 'Unknown error');
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
