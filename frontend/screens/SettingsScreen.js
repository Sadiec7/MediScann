import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { SettingsScreen_styles as styles } from '../styles';

const SettingsScreen = () => {
  const { logout, currentUser } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas salir de tu cuenta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Salir',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header minimalista */}
      <View style={styles.header} />
      
      {/* Contenido principal */}
      <View style={styles.contentContainer}>
        <View style={styles.userContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={36} color="#2D46FF" />
          </View>
          <Text style={styles.userName}>
            {currentUser?.nombre || 'Usuario MediScann'}
          </Text>
          <Text style={styles.userEmail}>
            {currentUser?.correo || 'usuario@example.com'}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>MediScann v1.0.0</Text>
      </View>
    </View>
  );
};

export default SettingsScreen;