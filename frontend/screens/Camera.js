import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Share, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
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

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] = MediaLibrary.usePermissions();
  const [prediction, setPrediction] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    loadHistory();
    requestGalleryPermission();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('analysisHistory');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const saveResult = async (result) => {
    const newEntry = {
      ...result,
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
    };
    
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    
    try {
      await AsyncStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsLoading(true);
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
        await analyzeImage(photo.uri);
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setPhotoUri(result.assets[0].uri);
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setPrediction('Error al seleccionar imagen');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeImage = async (uri) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'skin_analysis.jpg',
      });

      const API_URL = __DEV__ 
        ? 'http://192.168.1.X:5000/predict'
        : 'https://tu-api-produccion.com/predict';

      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 15000,
      });
      
      const result = {
        disease: response.data.disease,
        confidence: response.data.confidence,
        imageUri: uri
      };
      
      setPrediction(
        response.data.confidence 
          ? `${response.data.disease} (${(response.data.confidence * 100).toFixed(1)}% confianza)`
          : response.data.disease
      );
      
      await saveResult(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error de red:', error.message);
        setPrediction('Error de conexión con el servidor');
      } else {
        console.error('Error inesperado:', error);
        setPrediction('Error al analizar la imagen');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const shareResult = async () => {
    try {
      await Share.share({
        message: `Resultado de análisis de piel: ${prediction}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
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
          <Text style={commonStyles.buttonText}>Conceder Permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {showHistory ? (
        <View style={historyStyles.container}>
          <ScrollView>
            {history.length > 0 ? (
              history.map((item) => (
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
              <Text style={historyStyles.emptyText}>No hay análisis previos</Text>
            )}
          </ScrollView>
          <TouchableOpacity 
            onPress={() => setShowHistory(false)}
            style={[commonStyles.button, historyStyles.backButton]}
          >
            <Text style={commonStyles.buttonText}>Volver a la Cámara</Text>
          </TouchableOpacity>
        </View>
      ) : photoUri ? (
        <View style={resultStyles.container}>
          <Image source={{ uri: photoUri }} style={resultStyles.image} />
          
          <View style={resultStyles.resultCard}>
            <Text style={resultStyles.title}>Resultado del Análisis:</Text>
            <Text style={resultStyles.resultText}>{prediction}</Text>
            
            <View style={resultStyles.buttonRow}>
              <TouchableOpacity 
                onPress={() => setPhotoUri(null)}
                style={[commonStyles.button, commonStyles.primaryButton, resultStyles.actionButton]}
              >
                <Text style={commonStyles.buttonText}>Nuevo Análisis</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={shareResult}
                style={[commonStyles.button, commonStyles.secondaryButton, resultStyles.actionButton]}
                disabled={!prediction}
              >
                <Text style={commonStyles.buttonText}>Compartir</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              onPress={() => setShowHistory(true)}
              style={[commonStyles.button, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary }]}
            >
              <Text style={[commonStyles.buttonText, { color: colors.primary }]}>Ver Historial</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={cameraStyles.container}>
          <CameraView 
            ref={cameraRef} 
            style={cameraStyles.camera}
            facing="back"
            zoom={zoom}
            enableTorch={false}
          />
          
          <View style={cameraStyles.overlay}>
            <View style={cameraStyles.controlsRow}>
              <TouchableOpacity 
                onPress={pickImage}
                style={[cameraStyles.sideButton, commonStyles.button]}
              >
                <Text style={commonStyles.buttonText}>📁 Galería</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={takePicture} 
                style={cameraStyles.captureButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color={colors.white} />
                ) : (
                  <View style={cameraStyles.captureButtonInner} />
                )}
              </TouchableOpacity>
              
              {history.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setShowHistory(true)}
                  style={[cameraStyles.sideButton, commonStyles.button]}
                >
                  <Text style={commonStyles.buttonText}>Historial</Text>
                </TouchableOpacity>
              )}
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