import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import axios, { AxiosError, AxiosResponse } from 'axios';

type PredictionResponse = {
  disease: string;
  confidence?: number;
};

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [prediction, setPrediction] = useState<string>('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const takePicture = async (): Promise<void> => {
    if (cameraRef.current) {
      try {
        setIsLoading(true);
        const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
        await uploadPhoto(photo.uri);
      } catch (error) {
        console.error('Error al tomar la foto:', error);
        setPrediction('Error al capturar la imagen');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const uploadPhoto = async (uri: string): Promise<void> => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'skin_photo.jpg',
    } as unknown as Blob); // TypeScript workaround for React Native FormData

    try {
      const response: AxiosResponse<PredictionResponse> = await axios.post(
        'http://TU_API_DOCKER/predict',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000, // 30 segundos timeout
        }
      );
      
      setPrediction(
        response.data.confidence 
          ? `${response.data.disease} (${(response.data.confidence * 100).toFixed(1)}% confianza)`
          : response.data.disease
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error al enviar la imagen:', axiosError.message);
      setPrediction('Error al analizar la imagen');
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Solicitando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Necesitamos acceso a la cámara para analizar tu piel
        </Text>
        <TouchableOpacity 
          onPress={requestPermission} 
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef} 
        style={styles.camera}
        facing="back"
        mode="picture"
        enableTorch={false}
        zoom={0}
      >
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            onPress={takePicture} 
            style={styles.captureButton}
            disabled={isLoading}
          >
            <View style={[
              styles.captureButtonInner,
              isLoading && styles.captureButtonDisabled
            ]} />
          </TouchableOpacity>
        </View>
      </CameraView>
      
      {photoUri && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>Última foto tomada:</Text>
        </View>
      )}
      
      {prediction && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Resultado del análisis:</Text>
          <Text style={styles.resultText}>{prediction}</Text>
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Analizando imagen...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  captureButtonDisabled: {
    backgroundColor: 'gray',
  },
  previewContainer: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  previewText: {
    color: 'white',
    fontSize: 16,
  },
  resultContainer: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
  },
  resultTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultText: {
    color: 'white',
    fontSize: 18,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
});