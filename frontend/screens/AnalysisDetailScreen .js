import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnalysisDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { analysis } = route.params;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Resultado de análisis dermatológico:\n\nFecha: ${analysis.date}\nDiagnóstico: ${analysis.disease}\n\nAplicación MediScann`,
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
        'Eliminar análisis',
        '¿Estás seguro que deseas eliminar este análisis?\nEsta acción no se puede deshacer.',
        [
        {
            text: 'Cancelar',
            style: 'cancel',
        },
        {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
            try {
                // Obtener historial actual
                const historyString = await AsyncStorage.getItem('analysisHistory');
                if (!historyString) return;

                const history = JSON.parse(historyString);

                // Filtrar para eliminar el análisis actual
                const updatedHistory = history.filter(item => item.id !== analysis.id);

                // Guardar cambios
                await AsyncStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));

                // Regresar a la pantalla anterior
                navigation.goBack();
            } catch (error) {
                console.error('Error eliminando análisis:', error);
            }
            },
        },
        ]
    );
    };

  // Función para formatear la fecha legible
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del análisis</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Imagen del análisis */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: analysis.imageUri }} 
            style={styles.analysisImage} 
            resizeMode="contain"
          />
        </View>

        {/* Diagnóstico */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resultado del diagnóstico</Text>
          <Text style={styles.diagnosisText}>{analysis.disease}</Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color="#2D46FF" />
            <Text style={styles.detailText}>{analysis.date}</Text>
          </View>
        </View>

        {/* Recomendaciones */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recomendaciones</Text>
          <Text style={styles.recommendationText}>
            {getRecommendations(analysis.disease)}
          </Text>
        </View>
      </ScrollView>

      {/* Botón flotante */}
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Ionicons name="share-social" size={24} color="white" />
        <Text style={styles.shareButtonText}>Compartir</Text>
      </TouchableOpacity>
    </View>
  );
};

// Función para recomendaciones
const getRecommendations = (diagnosis) => {
  const recommendations = {
    melanoma: 'Consulta con un dermatólogo inmediatamente. Evita la exposición solar directa y usa protector solar FPS 50+.',
    nevus: 'Control periódico con especialista. Fotografíalo mensualmente para monitorear cambios.',
    eczema: 'Usa cremas hidratantes sin fragancia. Evita jabones agresivos y baños muy calientes.',
    acne: 'Limpieza suave dos veces al día. Evita tocar las lesiones y consulta sobre tratamientos tópicos.',
    default: 'Consulta con un profesional de la salud para evaluación y tratamiento adecuado.'
  };

  return recommendations[diagnosis.toLowerCase()] || recommendations.default;
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  imageContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  analysisImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D46FF',
    marginBottom: 15,
  },
  diagnosisText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  shareButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2D46FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default AnalysisDetailScreen;