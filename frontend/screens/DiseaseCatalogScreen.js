// screens/DiseaseCatalogScreen.js

import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const diseases = [
  {
    id: "1",
    name: "Acne",
    image: require("../assets/diseases/acne.jpg"),
    description:
      "A skin condition that occurs when hair follicles become clogged with oil and dead skin cells.",
  },
  {
    id: "2",
    name: "Melanoma",
    image: require("../assets/diseases/melanoma.jpg"),
    description:
      "A type of skin cancer that can spread to other organs in the body.",
  },
  {
    id: "3",
    name: "Peeling skin",
    image: require("../assets/diseases/peeling.jpg"),
    description:
      "When your skin starts shedding or flaking due to damage or irritation.",
  },
  {
    id: "4",
    name: "Ring worm",
    image: require("../assets/diseases/ringworm.jpg"),
    description:
      "A fungal infection that causes a ring-shaped rash on the skin.",
  },
  {
    id: "5",
    name: "Vitiligo",
    image: require("../assets/diseases/vitiligo.jpg"),
    description: "A condition in which the skin loses its pigment cells.",
  },
];

const DiseaseCatalogScreen = () => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.analysisCard}
      onPress={() => navigation.navigate("DiseaseDetail", { disease: item })}
    >
      <Image source={item.image} style={styles.analysisImage} />
      <View style={styles.analysisInfo}>
        <Text style={styles.analysisResult}>{item.name}</Text>
        <Text style={styles.analysisDate} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Enciclopedia</Text>
        <View style={{ width: 24 }} />
      </View>
  
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Enfermedades comunes</Text>
        <FlatList
          data={diseases}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 80,
    backgroundColor: "#2D46FF",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 12,
  },
  analysisCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  analysisImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  analysisInfo: {
    flex: 1,
  },
  analysisDate: {
    color: "#666",
    fontSize: 14,
  },
  analysisResult: {
    color: "#333",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default DiseaseCatalogScreen;
