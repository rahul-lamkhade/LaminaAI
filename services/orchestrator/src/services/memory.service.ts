import { ChatMessage } from '../types/message';
import { VectorService } from './vector.service';
import { MAX_MEMORY, summarizeMessageStart, ragMessageStart, MEMORY_TRIGGERS } from '../config/constants';
import { LlmService } from './llm.service';

const vectorService = new VectorService();
const llmService = new LlmService();

export class MemoryService {
  private memoryStack: ChatMessage[] = [];
  private archiveBuffer: ChatMessage[] = [];

  getMemory(): ChatMessage[] {
    return this.memoryStack;
  }

  setMemoryFromSummaries(summaries: string[]) {
    let messages: ChatMessage[] = [];
    messages = summaries.map(summary => ({
      role: 'assistant',
      content: `${summarizeMessageStart} ${summary}`
    }));
    this.memoryStack.push(...messages);
  }

  addMessage(message: ChatMessage) {
    const nonSystemMessages = this.memoryStack.filter(m => m.role !== 'system');

    if (nonSystemMessages.length >= MAX_MEMORY) {
      const oldest = this.memoryStack[1]; // assume index 0 is system
      if (
        !oldest.content.startsWith(summarizeMessageStart) &&
        !oldest.content.startsWith(ragMessageStart)
      ) {
        this.archiveBuffer.push(oldest);
      }

      this.memoryStack.splice(1, 1); // remove oldest
    }

    this.memoryStack.push(message);

    if (this.archiveBuffer.length >= MAX_MEMORY) {
      this.summarizeAndPersist();
    }
  }

  private async summarizeAndPersist() {
    const summary = await llmService.summarize(this.archiveBuffer);
    await vectorService.saveSummary(summary);
    this.archiveBuffer = [];
  }

  async getRAGContext(query: string) {
    let ragMemories: ChatMessage[] = [];
    
    if (this.shouldTriggerRAG(query)) {
        const results = await vectorService.fetchRelatedMemories(query);
        ragMemories = results.map((content) => ({
            role: 'assistant',
            content: `${ragMessageStart} ${content}`
        }));
    }
    this.memoryStack.push(...ragMemories);
  }

  private shouldTriggerRAG(input: string): boolean {
    const lower = input.toLowerCase();
    return MEMORY_TRIGGERS.some(trigger => lower.includes(trigger));
  }
}
