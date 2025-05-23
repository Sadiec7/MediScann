import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { HomeScreen_styles as styles } from '../styles';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const filteredAnalyses = recentAnalyses.filter(
    (item) =>
      item.userId?.toLowerCase() === userData?.correo?.toLowerCase()
  );

  // Cargar datos del usuario y análisis al iniciar
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // 1. Cargar datos del usuario
          const userString = await AsyncStorage.getItem("userData");
          if (userString) {
            const user = JSON.parse(userString);
            setUserData(user);
          }

          // 2. Cargar historial de análisis
          const historyString = await AsyncStorage.getItem("analysisHistory");
          if (historyString) {
            setRecentAnalyses(JSON.parse(historyString).slice(0, 3));
          } else {
            setRecentAnalyses([]); // En caso de que no haya historial
          }
        } catch (error) {
          console.error("Error cargando datos:", error);
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

  const formatDate = (dateString) => {
    // Si ya es una cadena formateada (para los items antiguos)
    if (typeof dateString === 'string' && dateString.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
      return dateString;
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

  return (
    <View style={styles.container}>
      {/* Header con bienvenida */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          ¡Hola, {userData.nombre || "Usuario"}!
        </Text>
      </View>

      {/* Contenido principal */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Acciones rápidas */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("Camera")}
          >
            <Ionicons name="camera" size={28} color="#2D46FF" />
            <Text style={styles.actionText}>Analizar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("History")}
          >
            <Ionicons name="time" size={28} color="#2D46FF" />
            <Text style={styles.actionText}>Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate("Catalog")}
          >
            <Ionicons name="book" size={28} color="#2D46FF" />
            <Text style={styles.actionText}>Enciclopedia</Text>
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
              onPress={() =>
                navigation.navigate("AnalysisDetail", { analysis })
              }
            >
              <Image
                source={{ uri: analysis.imageUri }}
                style={styles.analysisImage}
              />
              <View style={styles.analysisInfo}>
                <Text style={styles.analysisDate}>{formatDate(analysis.date)}</Text>
                <Text style={styles.analysisResult}>
                  {analysis.disease || "Sin diagnóstico"}
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
            Evita tocarte el rostro con las manos sucias para prevenir
            irritaciones
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;