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

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFocus = (inputIndex) => {
    setTimeout(() => {
      const offset = (Platform.OS === 'ios' ? 100 : 80) + inputIndex * 60; 
      scrollViewRef.current?.scrollTo({ y: offset, animated: true });
    }, 100);
  };

  const handleSignUp = async () => {
    if (!formData.nombre || !formData.correo || !formData.contrasena) {
      setErrorMessage('Todos los campos son obligatorios');
      return;
    }
  
    try {
      // Guardar los datos del usuario en AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(formData));
      console.log('Usuario registrado:', formData);
      
      // También puedes guardar datos individuales si lo necesitas
      await AsyncStorage.setItem('username', formData.nombre);
      await AsyncStorage.setItem('email', formData.correo);
      
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