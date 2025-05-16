import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importa tus pantallas
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import CameraScreen from './screens/CameraScreen';
import SettingsScreen from './screens/SettingsScreen';
import AnalysisDetailScreen from './screens/AnalysisDetailScreen ';
import HistoryScreen from './screens/HistoryScreen';
import DiseaseCatalogScreen from './screens/DiseaseCatalogScreen';
import DiseaseDetailScreen from './screens/DiseaseDetailScreen';
import ChatBotScreen from './screens/ChatBotScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 1. Stack para History (compartido)
const HistoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HistoryMain" component={HistoryScreen} />
  </Stack.Navigator>
);

// 2. HomeStack (Home + AnalysisDetail + History)
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="AnalysisDetail" component={AnalysisDetailScreen} />
    <Stack.Screen name="History" component={HistoryStack} />
    <Stack.Screen name="Catalog" component={DiseaseCatalogScreen} />
    <Stack.Screen name="DiseaseDetail" component={DiseaseDetailScreen} />
    <Stack.Screen name='ChatBot' component={ChatBotScreen} />
  </Stack.Navigator>
);

// 3. CameraStack (Camera + History)
const CameraStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CameraMain" component={CameraScreen} />
    <Stack.Screen name="History" component={HistoryStack} />
  </Stack.Navigator>
);

// 4. MainTabs (Home, Camera, Settings)
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Camera') iconName = focused ? 'camera' : 'camera-outline';
        else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3A7BFF',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        paddingBottom: 4,
        height: 80,
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Inicio' }} />
    <Tab.Screen name="Camera" component={CameraStack} options={{ title: 'Cámara' }} />
    <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configuración' }} />
  </Tab.Navigator>
);

// 5. AuthStack (Login + SignUp)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

// 6. RootNavigator (decide entre Auth o MainTabs)
const RootNavigator = () => {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// App principal con AuthProvider
export default function App() { 
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}