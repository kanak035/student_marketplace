import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      axios.get('http://localhost:5000/api/auth/protected')
        .then(res => {
          setUser({ id: res.data.userId });
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['x-auth-token'];
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      setUser({ id: res.data.userId });
      return true;
    } catch (err) {
      console.error('Login error:', err.response?.data?.msg);
      return false;
    }
  };

  const signup = async (email, password, name, collegeId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', { email, password, name, collegeId });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      setUser({ id: res.data.userId });
      return true;
    } catch (err) {
      console.error('Signup error:', err.response?.data?.msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}