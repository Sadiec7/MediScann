import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { DiseaseDetailScreen_styles as styles } from '../styles';

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

export default DiseaseDetailScreen;