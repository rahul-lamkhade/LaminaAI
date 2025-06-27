import { Router } from 'express';
import { generateChatResponse, exitChat } from './controllers/chat.controller';

const router = Router();

router.post('/chat', generateChatResponse);
router.get('/chat/exit', exitChat);
export default router;
