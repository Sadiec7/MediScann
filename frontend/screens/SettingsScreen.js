import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    height: 80, // Altura del header
    backgroundColor: '#2D46FF', // Mismo azul 
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    marginTop: 0, // Para que el contenido se superponga ligeramente
  },
  userContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    backgroundColor: '#E8F0FE',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF3B30',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 30,
    fontSize: 14,
  },
});

export default SettingsScreen;