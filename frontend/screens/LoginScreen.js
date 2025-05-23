import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { LoginScreen_styles as styles } from '../styles';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { login, isLoading, errorMessage, clearError } = useAuth();

  const navigateToSignUp = () => {
    setUsername('');
    setPassword('');
    navigation.navigate('SignUp');
  };

  const handleLogin = async () => {
    // Validación básica de email
    /*if (!username.includes('@') || !username.includes('.')) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }*/
    clearError();

    try {
      const success = await login(username, password);
      if (!success) {
        // Mantenemos los valores ingresados para corrección
        return;
      }
      // Limpia solo en éxito
      setUsername('');
      setPassword('');
    } catch (error) {
      // Mantiene los valores para que el usuario pueda reintentar
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <LinearGradient 
        colors={['#2D46FF', '#2D46FF']} 
        style={styles.gradientContainer}
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 0}}
      >
        <StatusBar barStyle="light-content" backgroundColor="#2D46FF" />
        
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Icon name="medical-outline" size={80} color="#fff" />
          </View>
          <Text style={styles.title}>MediScann</Text>
        </View>
      </LinearGradient>

      <View style={styles.bottomContainer}>
        <View style={styles.formContainer}>
          {errorMessage ? (
            <View style={styles.errorContainer} accessibilityLiveRegion="assertive">
              <Icon name="warning-outline" size={20} color="#ff4444" />
              <Text style={styles.errorText} accessibilityRole="alert">
                {errorMessage}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Correo</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ingresa tu email" 
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.passwordInput} 
              secureTextEntry={secureEntry}
              placeholder="Ingresa tu contraseña" 
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setSecureEntry(!secureEntry)}
            >
              <Icon 
                name={secureEntry ? 'eye-off-outline' : 'eye-outline'} 
                size={20} 
                color="#aaa" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.signUpButton} onPress={navigateToSignUp}>
            <Text style={styles.signUpText}>¿No tienes cuenta? Crear cuenta</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Prevención dermatológica accesible para todos</Text>
      </View>
    </View>
  );
};

export default LoginScreen;