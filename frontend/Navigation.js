import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import CameraScreen from './screens/CameraScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CameraTab') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray'
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Camera" component={CameraScreen} options={{ title: 'Cámara' }} />
      <Tab.Screen name="Settings" component={HomeScreen} options={{ title: 'Ajustes' }} />
    </Tab.Navigator>
  );
};

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsLoggedIn(true);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name="HomeTabs" component={TabsNavigator} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


/*
import React, { useEffect, useState } from 'react' ;
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native' ;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true); // Estado de carga
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
    try {
        const storedUsername = await AsyncStorage.getItem( 'username' ) ;
        if (storedUsername) {
          setUsername(storedUsername) ;
        } 
      } catch (error) {
        console.error('Error al cargar el nombre de usuario: ", error) ;
      } finally {
        setLoading( false);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage. removeItem('username');
      navigation. replace( 'Login' ) ;
    } catch (error) {
      console.error('Error al cerrar sesión: ', error) ;
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles. container}>
    <Text style={styles.header}>Bienvenido, {username}</Text>
    <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
});
*/