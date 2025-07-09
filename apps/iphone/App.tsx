import React, { useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  TextInput,
  Button,
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { sendMessage, exit } from './services/chat.service';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const lower = input.trim().toLowerCase();
    const userMsg: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      if (lower === 'exit') {
        const farewell = await exit();
        setMessages(prev => [...prev, { sender: 'bot', text: farewell }]);
        Alert.alert('👋 Goodbye!', farewell);
        return;
      }

      const reply = await sendMessage(input);
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: '❌ Failed to send message: ' + err.message },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text style={item.sender === 'user' ? styles.user : styles.bot}>
            {item.sender === 'user' ? '🧑 You: ' : '🤖 Lamina: '}
            {item.text}
          </Text>
        )}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.row}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message or 'exit'..."
            style={styles.input}
          />
          <Button title="Send" onPress={handleSend} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: '80%',
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: '80%',
  },
});
