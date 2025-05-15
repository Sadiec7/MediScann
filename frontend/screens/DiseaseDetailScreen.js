import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const DiseaseDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { disease } = route.params;

  console.log("Disease param:", disease);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {typeof disease.name === 'string' ? disease.name : 'Sin nombre'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Image source={disease.image} style={styles.image} />
        <View style={styles.content}>
          {typeof disease.description === 'string' && (
            <Text style={styles.description}>{disease.description}</Text>
          )}

          <Text style={styles.sectionTitle}>Síntomas</Text>
          <Text style={styles.subtext}>
            (Aquí puedes agregar síntomas específicos si quieres expandir la información más adelante.)
          </Text>

          <Text style={styles.sectionTitle}>Tratamiento</Text>
          <Text style={styles.subtext}>
            (Puedes personalizar tratamientos o recomendaciones para cada enfermedad.)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
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
  scrollContainer: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    color: "#333",
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24, // Mejor legibilidad
  },
  subtext: {
    color: "#666",
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20, // Mejor legibilidad
  },
});

export default DiseaseDetailScreen;