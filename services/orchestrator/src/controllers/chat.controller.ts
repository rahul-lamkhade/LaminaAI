import { MemoryService } from '../services/memory.service';
import { LlmService } from '../services/llm.service';
import { VectorService } from '../services/vector.service';
import { prompts } from '../config/prompts';
import { Request, Response } from 'express';

const memoryService = new MemoryService();
const llmService = new LlmService();
const vectorService = new VectorService();

export async function generateChatResponse(req: Request, res: Response) {
  const { input } = req.body;
  try {
    const currentState = await memoryService.loadFromRedis();
    console.log('currentState', currentState);
    if(currentState.length == 0) {
      const summaries = await vectorService.fetchRecentSummaries(2);
      memoryService.setMemoryFromSummaries(summaries);
    }
    memoryService.addMessage({ role: 'user', content: input });

    await memoryService.getRAGContext(input);

    const context = memoryService.getMemory();
    
    const systemPrompt = prompts.default;

    const response = await llmService.send(systemPrompt, context);
    memoryService.addMessage({ role: 'assistant', content: response });
    res.json({ reply: response });
  } catch (err) {
    res.json({ reply: 'Lamina is unavailable. Please try again later.' })
  }
}

export async function exitChat(req: Request, res: Response) { 
  memoryService.clearMemory();
  res.json({ reply: 'Chat exited. Good Bye!' });
}
