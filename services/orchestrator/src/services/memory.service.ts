import redis from '../utils/redis';
import { ChatMessage } from '../types/message';
import { VectorService } from './vector.service';
import { MAX_MEMORY, summarizeMessageStart, ragMessageStart, MEMORY_TRIGGERS } from '../config/constants';
import { LlmService } from './llm.service';

const vectorService = new VectorService();
const llmService = new LlmService();
const SHORT_TERM_KEY = 'memory:user:short';
const ARCHIVE_KEY = 'memory:user:archive';

export class MemoryService {
  private memoryStack: ChatMessage[] = [];
  private archiveBuffer: ChatMessage[] = [];

  // Load from Redis
  async loadFromRedis(): Promise<ChatMessage[]> {
    const [memRaw, archiveRaw] = await Promise.all([
      redis.get(SHORT_TERM_KEY),
      redis.get(ARCHIVE_KEY),
    ]);

    this.memoryStack = memRaw ? JSON.parse(memRaw) : [];
    this.archiveBuffer = archiveRaw ? JSON.parse(archiveRaw) : [];
    return this.memoryStack;
  }

  private async persistBuffers() {
    await redis.set(SHORT_TERM_KEY, JSON.stringify(this.memoryStack));
    await redis.set(ARCHIVE_KEY, JSON.stringify(this.archiveBuffer));
  }

  getMemory(): ChatMessage[] {
    return this.memoryStack;
  }

  setMemoryFromSummaries(summaries: string[]) {
    const messages: ChatMessage[] = summaries.map(summary => ({
      role: 'assistant',
      content: `${summarizeMessageStart} ${summary}`
    }));
    this.memoryStack.push(...messages);
  }

  async addMessage(message: ChatMessage) {
    const nonSystemMessages = this.memoryStack.filter(m => m.role !== 'system');

    if (nonSystemMessages.length >= MAX_MEMORY) {
      const oldest = this.memoryStack[0];
      if (
        !oldest.content.startsWith(summarizeMessageStart) &&
        !oldest.content.startsWith(ragMessageStart)
      ) {
        this.archiveBuffer.push(oldest);
      }

      this.memoryStack.splice(0, 1); // remove oldest
    }

    this.memoryStack.push(message);

    if (this.archiveBuffer.length >= MAX_MEMORY) {
      this.summarizeAndPersist();
    }

    // persist after changes
    this.persistBuffers();
  }

  private async summarizeAndPersist() {
    const summary = await llmService.summarize(this.archiveBuffer);
    await vectorService.saveSummary(summary);
    this.archiveBuffer = [];
    // Clear and update archive buffer
    await redis.set(ARCHIVE_KEY, JSON.stringify([]));
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

  async clearMemory() {
    this.memoryStack = [];
    this.archiveBuffer = [];

    try {
      await redis.del(SHORT_TERM_KEY);
      await redis.del(ARCHIVE_KEY);
      console.log(`Cleared memory for session.`);
    } catch (err) {
      console.error('Failed to clear Redis memory:', err);
    }
  }
}
