import { getInput, outputResponse } from './controllers/input.controller';
import { sendMessage, exit } from './services/chat.service';

async function startChat() {
  console.log('💬 Lamina Chat Started');

  while (true) {
    const input = await getInput();
    try {
      if (input.trim().toLowerCase() === 'exit') {
        console.log('👋 Goodbye!');
        const response = await exit();
        console.log(response);
        break;
      }

      const response = await sendMessage(input);
      outputResponse(response);
    } catch (err: any) {
      console.error('❌ Failed to send message:', err.message);
    }
  }
}

startChat();
