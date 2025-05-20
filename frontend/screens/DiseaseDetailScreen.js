import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const DiseaseDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { disease } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{disease.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Image source={disease.image} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.description}>{disease.description}</Text>

          <Text style={styles.sectionTitle}>Síntomas</Text>
          <Text style={styles.subtext}>{disease.symptoms}</Text>

          <Text style={styles.sectionTitle}>Tratamiento</Text>
          <Text style={styles.subtext}>{disease.treatment}</Text>
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
    marginBottom: 25,
    lineHeight: 24,
    fontWeight: '500'
  },
  subtext: {
    color: "#444",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
});

export default DiseaseDetailScreen;