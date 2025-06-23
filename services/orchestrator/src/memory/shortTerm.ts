import { ChatMessage } from '../models/types';
import { systemPrompt } from '../agents/lamina';
import { summarizeMessages } from '../chat';
import { saveSummaryToMemory } from './longTerm';
import { MAX_MEMORY } from "../config/constant";
import { summarizeMessageStart, ragMessageStart } from '../config/constant';

const memory: ChatMessage[] = [systemPrompt];
const longTermBuffer: ChatMessage[] = [];

export function getMemory() {
    return memory;
}

export function setMemory(oldMemories: ChatMessage[]) {
  oldMemories.map(m => memory.push(m));
}

export async function remember(message: ChatMessage) {
  const nonSystemMessages = memory.filter(m => m.role !== 'system');

  if (nonSystemMessages.length >= MAX_MEMORY) {
    const oldest = memory[1]; // first non-system message
    if (!oldest.content.startsWith(summarizeMessageStart) || !oldest.content.startsWith(ragMessageStart)) {
      longTermBuffer.push(oldest);
    }
    memory.splice(1, 1); // remove oldest non-system message

    // When buffer fills, summarize and persist
    if (longTermBuffer.length >= MAX_MEMORY) {
      const summary = await summarizeMessages(longTermBuffer);
      await saveSummaryToMemory(summary);
      longTermBuffer.length = 0; // clear buffer
    }
  }

  memory.push(message);
}

