import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const filteredAnalyses = recentAnalyses.filter(item => item.userId === userData?.correo);

  // Cargar datos del usuario y análisis al iniciar
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // 1. Cargar datos del usuario
          const userString = await AsyncStorage.getItem('userData');
          if (userString) {
            const user = JSON.parse(userString);
            setUserData(user);
          }

          // 2. Cargar historial de análisis
          const historyString = await AsyncStorage.getItem('analysisHistory');
          if (historyString) {
            setRecentAnalyses(JSON.parse(historyString).slice(0, 3));
          } else {
            setRecentAnalyses([]); // En caso de que no haya historial
          }
        } catch (error) {
          console.error('Error cargando datos:', error);
        }
      };

      loadData();
    }, [])
  );

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D46FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con bienvenida */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          ¡Hola, {userData.nombre || 'Usuario'}!
        </Text>
      </View>

      {/* Contenido principal */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Acciones rápidas */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Camera')}
          >
            <Ionicons name="camera" size={28} color="#2D46FF" />
            <Text style={styles.actionText}>Nuevo análisis</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('History')}
          >
            <Ionicons name="time" size={28} color="#2D46FF" />
            <Text style={styles.actionText}>Historial</Text>
          </TouchableOpacity>
        </View>

        {/* Análisis recientes */}
        <Text style={styles.sectionTitle}>Tus últimos análisis</Text>
        {/*
          {recentAnalyses.length > 0 ? (
            recentAnalyses.map((analysis, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.analysisCard}
                onPress={() => navigation.navigate('AnalysisDetail', { analysis })}
              >
                <Image 
                  source={{ uri: analysis.imageUri }} 
                  style={styles.analysisImage} 
                />
                <View style={styles.analysisInfo}>
                  <Text style={styles.analysisDate}>{analysis.date}</Text>
                  <Text style={styles.analysisResult}>
                    {analysis.disease || 'Sin diagnóstico'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No hay análisis recientes</Text>
          )}
        */}
        {filteredAnalyses.length > 0 ? (
          filteredAnalyses.map((analysis, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.analysisCard}
              onPress={() => navigation.navigate('AnalysisDetail', { analysis })}
            >
              <Image 
                source={{ uri: analysis.imageUri }} 
                style={styles.analysisImage} 
              />
              <View style={styles.analysisInfo}>
                <Text style={styles.analysisDate}>{analysis.date}</Text>
                <Text style={styles.analysisResult}>
                  {analysis.disease || 'Sin diagnóstico'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No hay análisis recientes</Text>
        )}

        {/* Consejos */}
        <Text style={styles.sectionTitle}>Consejos de cuidado</Text>
        <View style={styles.tipCard}>
          <Ionicons name="sunny" size={24} color="#FFA726" />
          <Text style={styles.tipText}>
            Usa protector solar incluso en días nublados
          </Text>
        </View>
        
        <View style={styles.tipCard}>
          <Ionicons name="water" size={24} color="#42A5F5" />
          <Text style={styles.tipText}>
            Hidrata tu piel diariamente con una crema adecuada a tu tipo de piel
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="leaf" size={24} color="#66BB6A" />
          <Text style={styles.tipText}>
            Evita tocarte el rostro con las manos sucias para prevenir irritaciones
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#2D46FF',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    color: '#333',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 12,
  },
  analysisCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  analysisImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  analysisInfo: {
    flex: 1,
  },
  analysisDate: {
    color: '#666',
    fontSize: 14,
  },
  analysisResult: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  tipText: {
    marginLeft: 12,
    color: '#333',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;