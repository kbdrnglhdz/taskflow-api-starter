import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/task-routes';
import commentRoutes from './routes/commentRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', taskRoutes);
app.use('/api', commentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`TaskFlow API running on port ${PORT}`);
});

export default app;
const   x   =   1
