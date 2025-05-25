// 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
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ChatBotScreen_styles as styles } from '../styles';

export default function ChatBot() {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    diagnosis = "No se proporcionó diagnóstico",
    imageAnalysis = null,
    analysisData = {}
  } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef();

  const generateInitialRecommendations = (diagnosis) => {
    const recommendations = {
      "acné": [
        "Lavar la zona afectada dos veces al día con un limpiador suave",
        "Evitar tocar o pellizcar las lesiones",
        "Usar productos no comedogénicos",
        "Consultar a un dermatólogo si persiste después de 4 semanas"
      ],
      "eczema": [
        "Mantener la piel hidratada con cremas emolientes",
        "Evitar jabones fuertes y baños calientes prolongados",
        "Usar ropa de algodón suave",
        "Aplicar compresas frías para aliviar la picazón"
      ],
      "psoriasis": [
        "Exponer la piel afectada a breves periodos de luz solar",
        "Usar humectantes espesos después del baño",
        "Evitar el estrés y el consumo de alcohol",
        "Consultar a un dermatólogo para opciones de tratamiento"
      ],
      "melanoma": [
        "Usar protección solar estricta (FPS 50+)",
        "Evitar la exposición solar entre 10am y 4pm",
        "Monitorear cualquier cambio en la lesión",
        "Consulta dermatológica urgente"
      ]
    };

    const lowerDiagnosis = diagnosis.toLowerCase();
    let matched = [];

    for (const [key, value] of Object.entries(recommendations)) {
      if (lowerDiagnosis.includes(key)) {
        matched = value;
        break;
      }
    }

    return matched.length > 0 ? matched : [
      "Mantener el área afectada limpia y seca",
      "Evitar rascar o irritar la zona",
      "Consultar a un especialista si los síntomas persisten"
    ];
  };

  useEffect(() => {
    const tips = generateInitialRecommendations(diagnosis);
    const initialMessage = {
      role: "assistant",
      content: `👋 Hola, soy tu asistente médico. Tu diagnóstico es: "${diagnosis}".\n\nRecomendaciones:\n${tips.map(t => `• ${t}`).join('\n')}`,
      id: Date.now().toString(),
    };
    setMessages([initialMessage]);
  }, [diagnosis]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      role: "user",
      content: inputText,
      id: Date.now().toString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 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",
        },
        body: JSON.stringify({
          model: "mistral/mistral-7b-instruct",
          messages: [
            {
              role: "system",
              content: `Eres un asistente médico especializado en ${diagnosis}. Responde de forma clara, confiable y útil. Solo responde preguntas médicas.`
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: inputText }
          ]
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Respuesta de la API inválida");
      }

      const reply = data.choices[0].message.content;

      setMessages(prev => [...prev, {
        role: "assistant",
        content: reply,
        id: Date.now().toString(),
      }]);
    } catch (err) {
        console.error("Error en la solicitud a OpenRouter:", err);
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "⚠️ Error de conexión o respuesta inválida. Por favor, intenta de nuevo.",
          id: Date.now().toString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asistente médico</Text>
        <View style={{ width: 24 }} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={90}
        >
          {imageAnalysis && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageAnalysis }} style={styles.analysisImage} resizeMode="contain" />
              <Text style={styles.diagnosisText}>{diagnosis}</Text>
            </View>
          )}

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={item.role === "user" ? styles.userMessage : styles.botMessage}>
                <Text style={item.role === "user" ? styles.userMessageText : styles.botMessageText}>
                  {item.content}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 15 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Escribe tu pregunta..."
              placeholderTextColor="#999"
              multiline
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            {isLoading ? (
              <ActivityIndicator style={styles.loadingIndicator} color="#2D46FF" />
            ) : (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={!inputText.trim()}
              >
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}