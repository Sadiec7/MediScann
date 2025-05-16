import React, { useState, useRef } from 'react';
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
} from 'react-native';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef();

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { role: 'user', content: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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', // reemplaza esto con tu API Key
          'HTTP-Referer': 'https://tuapp.com', // opcional, si registraste uno
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',
          messages: [
            { role: 'system', content: 'Eres un asistente médico experto que da recomendaciones según el análisis de enfermedades de la piel.' },
            ...messages,
            { role: 'user', content: inputText },
          ],
        }),
      });

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || 'Lo siento, no entendí eso.';
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={item.role === 'user' ? styles.userMessage : styles.botMessage}>
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 10 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe tu mensaje..."
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
          />
          <Button title="Enviar" onPress={handleSendMessage} disabled={isLoading} />
        </View>
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
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e9e9e9',
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: '80%',
  },
  messageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
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
