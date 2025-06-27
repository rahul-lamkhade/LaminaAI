import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

export async function sendMessage(input: string): Promise<string> {
  const response = await axios.post(`${API_BASE_URL}/api/chat`, { input });
  return response.data.reply;
}

export async function exit(): Promise<string> {
  const response = await axios.get(`${API_BASE_URL}/api/chat/exit`);
  return response.data.reply;
}