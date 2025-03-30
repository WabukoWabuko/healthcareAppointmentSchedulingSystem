import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      axios
        .get('http://127.0.0.1:8000/api/auth/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setUser(res.data))
        .catch(() => {
          setUser(null);
          setToken('');
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://127.0.0.1:8000/api/auth/jwt/create/', { email, password });
    setToken(res.data.access);
    localStorage.setItem('token', res.data.access);
    const userRes = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', {
      headers: { Authorization: `Bearer ${res.data.access}` },
    });
    setUser(userRes.data);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
