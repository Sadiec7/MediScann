import React, { useState, useRef, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Share, Image, Alert, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import NetInfo from '@react-native-community/netinfo';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  colors,
  spacing,
  globalStyles,
  cameraStyles,
  resultStyles,
  historyStyles,
  commonStyles,
  utilityStyles,
  text
} from '../styles';

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] = MediaLibrary.usePermissions();
  const [prediction, setPrediction] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const cameraRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [userData, setUserData] = useState(null);
  const filteredHistory = history.filter(item => item.userId === userData?.correo);
  const [isConnected, setIsConnected] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [predictionData, setPredictionData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true);

      return () => {
        setIsCameraActive(false);
      };
    }, [])
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }

        const savedHistory = await AsyncStorage.getItem('analysisHistory');
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      }

      requestGalleryPermission();
    };

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    loadInitialData();

    return () => {
      unsubscribe();
    };
  }, []);

  const saveResult = async (result) => {
    if (!userData?.correo) {
      console.error("No hay usuario identificado para guardar el análisis");
      return;
    }

    const newEntry = {
      ...result,
      id: Date.now().toString(),
      userId: userData.correo.toLowerCase(), // Guardar en minúsculas para consistencia
      date: new Date().toISOString(),
    };

    try {
      const stored = await AsyncStorage.getItem('analysisHistory');
      const currentHistory = stored ? JSON.parse(stored) : [];
      
      // Agregar el nuevo análisis (sin filtrar los anteriores)
      const updatedHistory = [newEntry, ...currentHistory];
      
      // Limitar a 100 análisis máximo
      const limitedHistory = updatedHistory.slice(0, 100);
      
      await AsyncStorage.setItem('analysisHistory', JSON.stringify(limitedHistory));
      
      // Actualizar el estado local si es necesario
      setHistory(limitedHistory.filter(item => 
        item.userId?.toLowerCase() === userData.correo.toLowerCase()
      ));
    } catch (error) {
      console.error('Error saving history:', error);
      Alert.alert('Error', 'No se pudo guardar el análisis');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsLoading(true);
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
        setPrediction('');
        setSelectedMode(null);
      } catch (error) {
        console.error('Error taking picture:', error);
        setPrediction('Error al capturar la imagen');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const pickImage = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaType: 'photo',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setPrediction('Error al seleccionar imagen');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeImage = async (mode) => {
    if (!photoUri) return;

    setIsLoading(true);
    setApiLoading(true);
    setSelectedMode(mode);

    try {
      const formData = new FormData();
      formData.append('images', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'skin_analysis.jpg',
      });

      const API_URL = mode === 'dermatology'
        ? 'http://192.168.0.28:5000/predict' //148.220.214.136:5000
        : 'http://192.168.0.28:5000/health';

      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });

      let result;

      if (API_URL.includes('/health')) {
        const predictionArray = response.data['Predicción'];
        const confidence = predictionArray?.[0]?.[0] ?? null;

        result = {
          disease: confidence !== null ? `Condición detectada (${(confidence * 100).toFixed(2)}%)`  : 'Desconocido',
          confidence: confidence,
          imageUri: photoUri
        };

        setPrediction(`Riesgo de caries: ${(confidence * 100).toFixed(2)}%`);
      } else {
        const predictions = response.data.predictions;

        if (predictions && predictions.length > 0) {
          result = {
            disease: predictions[0],
            confidence: null,
            imageUri: photoUri
          };

          setPrediction(predictions[0]);
        } else {
          setPrediction('No se detectó ninguna condición.');
        }
      }

      await saveResult(result);
      setPredictionData(result);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        Alert.alert('Error', 'La conexión con el servidor tardó demasiado');
      } else if (error.message === 'Network Error') {
        Alert.alert('Error', 'No se pudo conectar al servidor. Verifica tu conexión.');
      } else {
        console.error('Error desconocido:', error);
        Alert.alert('Error', 'Ocurrió un error al comunicarse con el servidor');
      }

      if (axios.isAxiosError(error)) {
        console.error('Error de red:', error.message);
        setPrediction('Error de conexión con el servidor');
      } else {
        console.error('Error inesperado:', error);
        setPrediction('Error al analizar la imagen');
      }
    } finally {
      setIsLoading(false);
      setApiLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const shareResult = async () => {
    try {
      const shareOptions = {
        title: 'Compartir resultado',
        message: `Resultado del análisis:\n\nFecha: ${formatDate(new Date().toISOString())}\nDiagnóstico: ${predictionData.disease || prediction}\n\nAplicación MediScann`,
        url: photoUri,
        type: 'image/jpeg',
      };
  
      await Share.share(shareOptions, {
        dialogTitle: 'Compartir resultado de análisis',
        subject: 'Resultado dermatológico',
      });
    } catch (error) {
      console.error('Error al compartir:', error);
      Alert.alert('Error', 'No se pudo compartir el análisis');
    }
  };

  const adjustZoom = (value) => {
    setZoom(Math.min(Math.max(0, zoom + value), 1));
  };

  if (!permission || !galleryPermission) {
    return (
      <View style={[globalStyles.container, globalStyles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[text.body, utilityStyles.mt_md]}>Solicitando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted || !galleryPermission.granted) {
    return (
      <View style={[globalStyles.container, globalStyles.centerContent, utilityStyles.p_md]}>
        <Text style={[text.body, utilityStyles.mb_md, utilityStyles.textCenter]}>
          Necesitamos acceso a la cámara y galería para analizar tu piel
        </Text>
        <TouchableOpacity 
          onPress={() => {
            requestPermission();
            requestGalleryPermission();
          }} 
          style={[commonStyles.button, commonStyles.primaryButton]}
        >
          <Text style={commonStyles.buttonText}>Conceder permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Modal
        transparent={true}
        animationType="fade"
        visible={apiLoading}
        onRequestClose={() => setApiLoading(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center'
          }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 10 }}>Analizando imagen...</Text>
          </View>
        </View>
      </Modal>

      {showHistory ? (
        <View style={historyStyles.container}>
          <ScrollView>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <View key={item.id} style={historyStyles.item}>
                  <Image source={{ uri: item.imageUri }} style={historyStyles.itemImage} />
                  <View style={historyStyles.itemContent}>
                    <Text style={historyStyles.itemDate}>{item.date}</Text>
                    <Text style={historyStyles.itemResult}>{item.disease}</Text>
                    {item.confidence && (
                      <Text style={historyStyles.itemConfidence}>
                        Confianza: {(item.confidence * 100).toFixed(1)}%
                      </Text>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={[historyStyles.emptyText, { marginTop: 100 }]}>No hay análisis previos</Text>
            )}
          </ScrollView>
        </View>
      ) : photoUri ? (
        <View style={resultStyles.container}>
          <Image source={{ uri: photoUri }} style={resultStyles.image} />
          
          <View style={resultStyles.resultCard}>
            {!prediction ? (
              <>
                <Text style={resultStyles.title}>Selecciona el tipo de análisis:</Text>
                
                <View style={[resultStyles.buttonRow, { marginBottom: 20 }]}>
                  <TouchableOpacity 
                    onPress={() => analyzeImage('dermatology')}
                    style={[commonStyles.button, commonStyles.primaryButton, resultStyles.actionButton]}
                    disabled={isLoading}
                  >
                    <Text style={commonStyles.buttonText}>Dermatología</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => analyzeImage('radiology')}
                    style={[commonStyles.button, commonStyles.secondaryButton, resultStyles.actionButton]}
                    disabled={isLoading}
                  >
                    <Text style={commonStyles.buttonText}>Radiografía</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                  onPress={() => setPhotoUri(null)}
                  style={[commonStyles.button, { backgroundColor: colors.background }]}
                >
                  <Text style={[commonStyles.buttonText, { color: colors.primary }]}>Volver a capturar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={resultStyles.title}>Resultado del análisis ({selectedMode === 'dermatology' ? 'Dermatología' : 'Radiografía'}):</Text>
                <Text style={resultStyles.resultText}>{prediction}</Text>
                
                <View style={resultStyles.buttonRow}>
                  <TouchableOpacity 
                    onPress={() => {
                      setPhotoUri(null);
                      setPrediction('');
                    }}
                    style={[commonStyles.button, commonStyles.primaryButton, resultStyles.actionButton]}
                  >
                    <Text style={commonStyles.buttonText}>Nuevo análisis</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={shareResult}
                    style={[commonStyles.button, commonStyles.secondaryButton, resultStyles.actionButton]}
                    disabled={!prediction}
                  >
                    <Text style={commonStyles.buttonText}>Compartir</Text>
                  </TouchableOpacity>
                </View>

                {/* Botón del Chatbot agregado aquí */}
                <View style={resultStyles.buttonRow}>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('ChatBot', 
                      {
                        diagnosis: prediction,
                      }
                    )}
                    style={[commonStyles.button, commonStyles.tertiaryButton, resultStyles.actionButton]}
                  >
                    <Ionicons name="chatbubbles" size={20} color="white" />
                    <Text style={[commonStyles.buttonText, {marginLeft: 8}]}>Hablar con el chatbot</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                  onPress={() => navigation.navigate('History')}
                  style={[commonStyles.button, { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.primary }]}
                >
                  <Text style={[commonStyles.buttonText, { color: colors.primary }]}>Historial</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      ) : (
        <View style={cameraStyles.container}>
          {isCameraActive && (
            <CameraView 
              ref={cameraRef} 
              style={cameraStyles.camera}
              facing="back"
              zoom={zoom}
              enableTorch={false}
            />
          )}
          
          <View style={cameraStyles.overlay}>
            <View style={cameraStyles.controlsRow}>
              <TouchableOpacity 
                onPress={pickImage}
                style={[cameraStyles.sideButton, commonStyles.button,
                  !isConnected && { backgroundColor: colors.disabled }]}
              >
                <Text style={commonStyles.buttonText}>📁 Galería</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={takePicture} 
                style={[
                  cameraStyles.captureButton,
                  !isConnected && { backgroundColor: colors.disabled }
                ]}
                disabled={isLoading || !isConnected}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color={colors.white} />
                ) : (
                  <View style={cameraStyles.captureButtonInner} />
                )}
              </TouchableOpacity>

              {!isConnected && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                  }}
                >
                  <MaterialIcons name="signal-wifi-off" size={80} color="white" />
                  <Text style={{ color: 'white', fontSize: 24, marginTop: 10 }}>Sin conexión</Text>
                </View>
              )}
              
              <TouchableOpacity 
                onPress={() => navigation.navigate('History')}
                style={[cameraStyles.sideButton, commonStyles.button]}
              >
                <Text style={commonStyles.buttonText}>Historial</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={cameraStyles.zoomControls}>
            <TouchableOpacity 
              onPress={() => adjustZoom(0.1)}
              style={cameraStyles.zoomButton}
              disabled={zoom >= 1}
            >
              <Text style={[text.h4, { color: colors.white }]}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => adjustZoom(-0.1)}
              style={cameraStyles.zoomButton}
              disabled={zoom <= 0}
            >
              <Text style={[text.h4, { color: colors.white }]}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}