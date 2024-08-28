import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(JSON.parse(localStorage.getItem('isAuth')) || false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [refugioId, setRefugioId] = useState(localStorage.getItem('refugioId') || null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('role') || null); // Nuevo estado para el rol

  useEffect(() => {
    if (token && (userId || refugioId)) {
      fetchUserData(userId || refugioId);
    }
  }, [token, userId, refugioId]);

  const fetchUserData = async (id) => {
    try {
      const endpoint = refugioId 
        ? `https://no-code-backend-sn9i.onrender.com/api/refugios/${id}`
        : `https://no-code-backend-sn9i.onrender.com/api/users/${id}`;
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Error fetching user data');
      }
      const data = await response.json();
      setUser(Array.isArray(data) ? data[0] : data); 
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const login = (newToken, id, role) => {
    setIsAuth(true);
    setToken(newToken);
    if (role === 'refugioId') {
      setRefugioId(id);
      localStorage.setItem('refugioId', id);
    } else {
      setUserId(id);
      localStorage.setItem('userId', id);
    }
    setRole(role); // Guardar el rol en el estado
    localStorage.setItem('isAuth', true);
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', role); // Guardar el rol en el localStorage
    fetchUserData(id);
  };

  const logout = () => {
    setIsAuth(false);
    setToken(null);
    setUserId(null);
    setRefugioId(null);
    setRole(null); // Limpiar el rol
    setUser(null);
    localStorage.removeItem('isAuth');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('refugioId');
    localStorage.removeItem('role'); // Limpiar el rol del localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuth, token, user, userId, refugioId, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
