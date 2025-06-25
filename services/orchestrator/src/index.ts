import { askUser } from './utils/input';
import { remember, getMemory, setMemory } from './memory/shortTerm';
import { sendToLamina } from './chat';
import { fetchRecentMemories } from './memory/longTerm';
import { ChatMessage } from './models/types';
import { summarizeMessageStart } from './config/constant';
import { getMemoryWithRAG } from './utils/rag';

async function main() {
  console.log("💬 Chat started with Lamina (Gemma 3)\n");

  // Setting old memories
  const oldMemories = await fetchRecentMemories(2);
  const LongTermMemoryMessages: ChatMessage[] = oldMemories
          .slice()
          .reverse()
          .map((summary) => ({
              role: 'assistant',
              content: `${summarizeMessageStart} ${summary}`
  }));
  setMemory(LongTermMemoryMessages);

  while (true) {
    const input = await askUser("> You: ");

    if (input.trim().toLowerCase() === "exit") {
      console.log("👋 Goodbye!");
      break;
    }

    remember({ role: 'user', content: input });

    const ragMemories: ChatMessage[] = await getMemoryWithRAG(input);
    setMemory(ragMemories);

    try {
      const reply = await sendToLamina(getMemory());
      console.log(`\Lamina: ${reply}\n`);
      remember({ role: 'assistant', content: reply });
    } catch (err) {
        console.error("❌ Error talking to Lamina:", err);
    }
  }
}

main();
