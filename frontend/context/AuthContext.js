import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    userToken: null,
    isLoading: true,
    currentUser: null,
    errorMessage: null,
  });

  const checkAuthState = useCallback(async () => {
    try {
      const [token, user] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('currentUser')
      ]);
      
      setState({
        userToken: token,
        currentUser: user ? JSON.parse(user) : null,
        isLoading: false
      });
    } catch (e) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const login = useCallback(async (username, password) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Lógica de autenticación
      const storedUser = await AsyncStorage.getItem('userData');
      if (!storedUser) {
        setState(prev => ({ ...prev, errorMessage: 'No hay usuarios registrados. Regístrese primero.' }));
        setState(prev => ({ ...prev, isLoading: false }));
        return false;  // Salimos sin propagación de error
        }

      const userData = JSON.parse(storedUser);
      const isValid = (userData.correo.toLowerCase() === username.toLowerCase()) && 
                      userData.contrasena === password;

      if (!isValid) {
        setState(prev => ({ ...prev, errorMessage: 'Credenciales inválidas' }));
        setState(prev => ({ ...prev, isLoading: false }));
        return false;  // Salimos sin propagación de error
        }

      const token = `fake-jwt-token-${Date.now()}`;
      await Promise.all([
        AsyncStorage.setItem('userToken', token),
        AsyncStorage.setItem('currentUser', storedUser)
      ]);
      
      setState({
        userToken: token,
        currentUser: userData,
        isLoading: false,
        errorMessage: null,
      });
      
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, errorMessage: error.message }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await Promise.all([
        AsyncStorage.removeItem('userToken'),
        AsyncStorage.removeItem('currentUser')
      ]);
      setState({
        userToken: null,
        currentUser: null,
        isLoading: false
      });
    } catch (e) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      userToken: state.userToken,
      isLoading: state.isLoading,
      currentUser: state.currentUser,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};