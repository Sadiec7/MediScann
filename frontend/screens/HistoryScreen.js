import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HistoryScreen = ({ userData }) => {
  const [history, setHistory] = useState([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const loadUserAndHistory = async () => {
        try {
          // 1. Cargar usuario primero
          const userString = await AsyncStorage.getItem('userData');
          const user = userString ? JSON.parse(userString) : null;
          
          if (!user?.correo) {
            console.log('No hay usuario logeado');
            setFilteredAnalyses([]);
            return;
          }

          // 2. Ahora cargar el historial
          const historyString = await AsyncStorage.getItem('analysisHistory');
          const parsedHistory = historyString ? JSON.parse(historyString) : [];

          // 3. Filtrar
          const filtered = parsedHistory.filter(item => 
            item.userId?.toLowerCase() === user.correo.toLowerCase()
          );

          setFilteredAnalyses(filtered);
          setHistory(parsedHistory);
          
        } catch (error) {
          console.error('Error:', error);
          setFilteredAnalises([]);
        }
      };

      loadUserAndHistory();
    }, []) // Eliminamos la dependencia de userData
  );

  const formatDate = (dateString) => {
    // Si ya es una cadena formateada (para los items antiguos)
    if (typeof dateString === 'string' && dateString.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
        return dateString; // Devolver tal cual si ya está formateada
    }

    let date;
    
    try {
        // Intentar parsear como ISO string primero
        date = new Date(dateString);
        
        // Si es inválido, intentar como timestamp
        if (isNaN(date.getTime())) {
        date = new Date(parseInt(dateString));
        }
        
        // Si sigue siendo inválido, usar fecha actual
        if (isNaN(date.getTime())) {
        date = new Date();
        }
        
        return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        });
    } catch {
        return 'Fecha no disponible';
    }
    };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AnalysisDetail', { analysis: item })}
    >
      <Image 
        source={{ uri: item.imageUri }} 
        style={styles.image} 
        onError={() => console.log("Error cargando imagen")}
      />
      <View style={styles.info}>
        <Text style={styles.disease}>
          {item.disease ? item.disease.toString() : 'Diagnóstico no disponible'}
        </Text>
        <Text style={styles.date}>
          {formatDate(item.date)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {filteredAnalyses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>No hay análisis en tu historial</Text>
          </View>
        ) : (
          <FlatList
            data={filteredAnalyses}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
};

// Tus estilos existentes...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2D46FF',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    color: '#888',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  disease: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});

export default HistoryScreen;