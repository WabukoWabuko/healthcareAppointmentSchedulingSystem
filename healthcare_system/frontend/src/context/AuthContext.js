import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
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
      const res = await axios.post('http://127.0.0.1:8000/api/auth/jwt/create/', { email, password }, {
        withCredentials: true,
      });
      const accessToken = res.data.access;
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      const userRes = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
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
