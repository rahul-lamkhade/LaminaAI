import { MemoryService } from '../services/memory.service';
import { LlmService } from '../services/llm.service';
import { getInput, outputResponse } from '../controllers/chat.controller';
import { VectorService } from '../services/vector.service';
import { prompts } from '../config/prompts';

const memoryService = new MemoryService();
const llmService = new LlmService();
const vectorService = new VectorService();

export async function startChatLoop() {
  const summaries = await vectorService.fetchRecentSummaries(2);
  memoryService.setMemoryFromSummaries(summaries);

  while (true) {
    const input = await getInput();

    if (input === 'exit') {
      console.log("👋 Goodbye!");
      break;
    }

    memoryService.addMessage({ role: 'user', content: input });

    await memoryService.getRAGContext(input);

    const context = memoryService.getMemory();
    const systemPrompt = prompts.default;

    const response = await llmService.send(systemPrompt, context);

    outputResponse(response);
    memoryService.addMessage({ role: 'assistant', content: response });
  }
}
