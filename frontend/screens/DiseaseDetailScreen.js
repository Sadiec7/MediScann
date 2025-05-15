// screens/DiseaseDetailScreen.js

import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const DiseaseDetailScreen = () => {
  const route = useRoute();
  const { disease } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={disease.image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{disease.name}</Text>
        <Text style={styles.description}>{disease.description}</Text>

        <Text style={styles.sectionTitle}>Síntomas</Text>
        <Text style={styles.subtext}>
          (Aquí puedes agregar síntomas específicos si quieres expandir la
          información más adelante.)
        </Text>

        <Text style={styles.sectionTitle}>Tratamiento</Text>
        <Text style={styles.subtext}>
          (Puedes personalizar tratamientos o recomendaciones para cada
          enfermedad.)
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
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
  },
  subtext: {
    color: "#666",
    fontSize: 14,
    marginBottom: 20,
  },
});

export default DiseaseDetailScreen;
