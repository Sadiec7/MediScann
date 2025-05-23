import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisDetailScreen_styles as styles } from '../styles';

const AnalysisDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { analysis } = route.params;

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

  const handleShare = async () => {
    try {
      const shareOptions = {
        title: 'Compartir resultado',
        message: `Resultado del análisis:\n\nFecha: ${formatDate(analysis.date)}\nDiagnóstico: ${analysis.disease}\n\nAplicación MediScann`,
        url: analysis.imageUri,  // Añade la URI de la imagen
        type: 'image/jpeg',     // Tipo MIME de la imagen
      };

      await Share.share(shareOptions, {
        dialogTitle: 'Compartir resultado de análisis',
        subject: 'Resultado dermatológico',  // Para emails
      });
    } catch (error) {
      console.error('Error al compartir:', error);
      Alert.alert('Error', 'No se pudo compartir el análisis');
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
            <Text style={styles.detailText}>{formatDate(analysis.date)}</Text>
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

export default AnalysisDetailScreen;