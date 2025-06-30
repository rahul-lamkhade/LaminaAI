import express from 'express';
import routes from './routes';

const app = express();
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend listening on port ${PORT}`));
