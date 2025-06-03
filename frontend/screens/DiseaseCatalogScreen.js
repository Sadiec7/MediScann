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
import { DiseaseCatalogScreen_styles as styles } from '../styles';

const diseases = [
  {
    id: "1",
    name: "Acné",
    image: require("../assets/diseases/acne.jpg"),
    description: "Condición cutánea por obstrucción de folículos pilosos.",
    symptoms: [
      "Puntos negros y blancos",
      "Pápulas rojas inflamadas",
      "Pústulas con pus",
      "Nódulos dolorosos",
      "Quistes grandes"
    ].join('\n'),
    treatment: [
      "Limpieza suave 2 veces/día",
      "Peróxido de benzoilo o ácido salicílico",
      "Antibióticos tópicos/orales",
      "Retinoides tópicos",
      "Terapia hormonal (mujeres)"
    ].join('\n')
  },
  {
    id: "2",
    name: "Melanoma",
    image: require("../assets/diseases/melanoma.jpg"),
    description: "Cáncer de piel en melanocitos que puede extenderse.",
    symptoms: [
      "Asimetría en lunares (ABCDE)",
      "Bordes irregulares",
      "Color variado",
      "Diámetro >6mm",
      "Evolución rápida",
      "Picazón/sangrado"
    ].join('\n'),
    treatment: [
      "Escisión quirúrgica",
      "Biopsia de ganglios",
      "Inmunoterapia",
      "Terapia dirigida",
      "Quimioterapia (avanzados)"
    ].join('\n')
  },
  {
    id: "3",
    name: "Descamación de la piel",
    image: require("../assets/diseases/peeling.jpg"),
    description: "Pérdida de capas superficiales de la piel.",
    symptoms: [
      "Piel seca y áspera",
      "Escamas blancas",
      "Picazón/ardor",
      "Enrojecimiento",
      "Grietas (casos severos)"
    ].join('\n'),
    treatment: [
      "Hidratación intensiva",
      "Baños cortos con agua tibia",
      "Evitar jabones agresivos",
      "Humectantes con urea",
      "Compresas frías"
    ].join('\n')
  },
  {
    id: "4",
    name: "Tiña (Anillo de gusano)",
    image: require("../assets/diseases/ringworm.jpg"),
    description: "Infección fúngica con erupción circular.",
    symptoms: [
      "Erupción en anillo",
      "Picazón intensa",
      "Escamas en la zona",
      "Enrojecimiento",
      "Pérdida de cabello (cuero cabelludo)"
    ].join('\n'),
    treatment: [
      "Antifúngicos tópicos/orales",
      "Mantener área seca",
      "Lavar ropa con agua caliente",
      "No compartir artículos personales"
    ].join('\n')
  },
  {
    id: "5",
    name: "Vitiligo",
    image: require("../assets/diseases/vitiligo.jpg"),
    description: "Pérdida de color en la piel por falta de melanocitos.",
    symptoms: [
      "Manchas blancas definidas",
      "Afecta manos/rostro",
      "Decoloración de cabello",
      "Sin molestias físicas"
    ].join('\n'),
    treatment: [
      "Fototerapia UVB",
      "Corticosteroides tópicos",
      "Inhibidores de calcineurina",
      "Injertos de piel",
      "Maquillaje corrector"
    ].join('\n')
  }
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

export default DiseaseCatalogScreen;