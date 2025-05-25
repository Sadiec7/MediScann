import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SignUpScreen_styles as styles } from '../styles';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const normalizeName = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const handleInputChange = (name, value) => {
    let newValue = value;
  
    if (name === 'nombre') {
      newValue = normalizeName(value);
    } else if (name === 'correo') {
      newValue = value.toLowerCase();
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleFocus = (inputIndex) => {
    setTimeout(() => {
      const offset = (Platform.OS === 'ios' ? 100 : 80) + inputIndex * 60; 
      scrollViewRef.current?.scrollTo({ y: offset, animated: true });
    }, 100);
  };

  const handleSignUp = async () => {
    const nameRegex = /^(?=.{1,20}$)[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:[ ' -][A-Za-zÁÉÍÓÚáéíóúÑñ]+){0,2}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!formData.nombre || !formData.correo || !formData.contrasena) {
      setErrorMessage('Todos los campos son obligatorios');
      return;
    }

    if (!nameRegex.test(formData.nombre)) {
      setErrorMessage('Nombre inválido (máx. 20 caracteres)');
      return;
    }

    if (!emailRegex.test(formData.correo)) {
      setErrorMessage('Correo electrónico inválido');
      return;
    }

    if (!passwordRegex.test(formData.contrasena)) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo');
      return;
    }
  
    try {
      const userDataToStore = {
        nombre: normalizeName(formData.nombre), // Asegurar formato al guardar
        correo: formData.correo.toLowerCase(),
        contrasena: formData.contrasena
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(userDataToStore));
      
      // También se pueden guardar datos individuales si se necesitan
      //await AsyncStorage.setItem('username', formData.nombre);
      //await AsyncStorage.setItem('email', formData.correo);
      
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      setErrorMessage('Error al guardar los datos. Intenta nuevamente');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2D46FF' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.mainContainer}
      >
        <TouchableOpacity 
          style={styles.dismissKeyboard} 
          activeOpacity={1} 
          onPress={Keyboard.dismiss}
        >
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* Ícono superior */}
            <View style={styles.topIconContainer}>
              <Icon name="medical-outline" size={40} color="#FFF" />
            </View>

            <View style={styles.formContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Icon name="arrow-back-outline" size={24} color="#2D46FF" />
                </TouchableOpacity>
                <Text style={styles.title}>Crea tu cuenta</Text>

              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Icon name="warning-outline" size={20} color="#ff4444" />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              <Text style={styles.label}>Nomre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu nombre"
                value={formData.nombre}
                onChangeText={(text) => handleInputChange('nombre', text)}
                onFocus={() => handleFocus(0)}
              />

              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu correo electrónico"
                value={formData.correo}
                onChangeText={(text) => handleInputChange('correo', text)}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onFocus={() => handleFocus(1)}
              />

              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Crea tu contraseña"
                  value={formData.contrasena}
                  onChangeText={(text) => handleInputChange('contrasena', text)}
                  secureTextEntry={secureEntry}
                  onFocus={() => handleFocus(2)}
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

              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;