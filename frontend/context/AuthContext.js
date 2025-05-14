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
        isLoading: false,
        errorMessage: null // Limpiar errores al verificar estado
      });
    } catch (e) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        errorMessage: 'Error al cargar la sesión' 
      }));
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, errorMessage: null }));
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      // Limpiar errores previos y activar loading
      setState(prev => ({ 
        ...prev, 
        isLoading: true,
        errorMessage: null 
      }));
      
      // Validación básica de campos
      if (!username || !password) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          errorMessage: 'Por favor ingresa usuario y contraseña' 
        }));
        return false;
      }

      // Lógica de autenticación
      const storedUser = await AsyncStorage.getItem('userData');
      if (!storedUser) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          errorMessage: 'No hay usuarios registrados. Regístrese primero.' 
        }));
        return false;
      }

      const userData = JSON.parse(storedUser);
      const isValid = (userData.correo.toLowerCase() === username.toLowerCase()) && 
                      userData.contrasena === password;

      if (!isValid) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          errorMessage: 'Credenciales inválidas' 
          // NO limpiamos userToken ni currentUser
        }));
        return false;
      }

      // Autenticación exitosa
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
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        errorMessage: error.message || 'Error al iniciar sesión' 
      }));
      return false;
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
        isLoading: false,
        errorMessage: null
      });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        errorMessage: 'Error al cerrar sesión' 
      }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      userToken: state.userToken,
      isLoading: state.isLoading,
      currentUser: state.currentUser,
      errorMessage: state.errorMessage, // Añadimos esto
      login,
      logout,
      clearError // Añadimos esta función
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