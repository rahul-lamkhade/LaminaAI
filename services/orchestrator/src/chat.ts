import axios from 'axios';
import { ChatMessage } from './models/types';
import { model } from './config/constant';

export async function sendToLamina(messages: ChatMessage[]): Promise<string> {
  const response = await axios.post('http://ollama:11434/api/chat', {
    model,
    messages,
    stream: false,
  });
  console.log('Current Memory', messages);

  const reply = response.data.message?.content?.trim();
  if (!reply) throw new Error('No response from model');
  return reply;
}

export async function summarizeMessages(messages: ChatMessage[]): Promise<string> {
  const prompt = [
    {
      role: 'system',
      content: 'You are a summarizer. Write a short 2–3 sentence summary of the most recent conversation. Be concise, emotional, and avoid listing every exchange. Just capture what matters most emotionally and contextually.'
    },
    {
      role: 'user',
      content: messages.map(m =>
        `${m.role === 'user' ? 'User' : 'Lamina'}: ${m.content}`
      ).join('\n')
    }
  ];

  const res = await axios.post('http://ollama:11434/api/chat', {
    model,
    messages: prompt,
    stream: false
  });

  return res.data.message?.content?.trim() || '[No summary]';
}
