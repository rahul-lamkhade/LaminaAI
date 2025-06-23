import { fetchDeepMemories } from '../memory/longTerm'; // function to call your /query endpoint
import { ChatMessage } from '../models/types';
import { ragMessageStart } from '../config/constant';
import { MEMORY_TRIGGERS } from '../config/triggers';

export async function getMemoryWithRAG(userInput: string): Promise<ChatMessage[]> {
  let ragMemories: ChatMessage[] = [];

  if (shouldTriggerRAG(userInput)) {
    const results = await fetchDeepMemories(userInput); // Use semantic search API
    console.log('RAG Results:', results);
    ragMemories = results.map((summary: string) => ({
      role: 'assistant',
      content: `${ragMessageStart} ${summary}`
    }));
  }

  return ragMemories;
}

export function shouldTriggerRAG(input: string): boolean {
  const lower = input.toLowerCase();
  return MEMORY_TRIGGERS.some(trigger => lower.includes(trigger));
}