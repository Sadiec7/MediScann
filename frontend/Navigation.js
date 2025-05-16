import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const flatListRef = useRef();

  const prediction = route.params?.prediction || 'sin predicción';

  // Enviar mensaje inicial con contexto
  useEffect(() => {
    const initialMessage = {
      role: 'user',
      content: `Hola, me hicieron un análisis y el resultado fue: ${prediction}. ¿Qué recomendaciones me das?`,
    };
    setMessages([initialMessage]);
    fetchBotResponse(initialMessage.content);
  }, []);

  const fetchBotResponse = async (messageText) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer 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', // ← cambia esto por tu clave
        },
        body: JSON.stringify({
          model: 'mistralai/mixtral-8x7b',
          messages: [{ role: 'user', content: messageText }],
        }),
      });

      const data = await response.json();
      const botReply = data?.choices?.[0]?.message?.content || 'Lo siento, no entendí eso.';
      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error('Error al conectar con el chatbot:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Error al conectar con el chatbot.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = { role: 'user', content: inputText };
    setMessages((prev) => [...prev, userMessage]);
    fetchBotResponse(inputText);
    setInputText('');
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.inner}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={item.role === 'user' ? styles.userMessage : styles.botMessage}>
                  <Text style={styles.messageText}>{item.content}</Text>
                </View>
              )}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Escribe tu mensaje..."
              />
              <Button title="Enviar" onPress={handleSendMessage} disabled={isLoading} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e9e9e9',
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: '80%',
  },
  messageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    backgroundColor: '#fff',
  },
});
