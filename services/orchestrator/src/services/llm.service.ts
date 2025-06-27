import axios from 'axios';
import { ChatMessage } from '../types/message';
import { model } from '../config/constants';

export class LlmService {
  private baseUrl = 'http://ollama:11434/api/chat';

  async send(systemPrompt: ChatMessage, messages: ChatMessage[]): Promise<string> {
    const response = await axios.post(this.baseUrl, {
      model,
      messages: [systemPrompt, ...messages],
      stream: false,
    });

    const reply = response.data.message?.content?.trim();
    if (!reply) throw new Error('No response from model');
    return reply;
  }

  async summarize(messages: ChatMessage[]): Promise<string> {
    const prompt: ChatMessage[] = [
      {
        role: 'system',
        content:
          'You are a summarizer. Write a short 2-3 sentence summary of the most recent conversation. Be concise, emotional, and avoid listing every exchange. Just capture what matters most emotionally and contextually.',
      },
      {
        role: 'user',
        content: messages
          .map((m) => `${m.role === 'user' ? 'User' : 'Lamina'}: ${m.content}`)
          .join('\n'),
      },
    ];

    const response = await axios.post(this.baseUrl, {
      model,
      messages: prompt,
      stream: false,
    });

    return response.data.message?.content?.trim() || '[No summary]';
  }
}
