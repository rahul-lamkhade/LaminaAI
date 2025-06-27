import { startChatLoop } from './workflows/chat.workflow';

async function main() {
  console.log("💬 Chat started with Lamina (Gemma 3)\n");
  await startChatLoop();
}

main();
