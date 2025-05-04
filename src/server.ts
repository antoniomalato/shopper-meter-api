import express from 'express';
import dotenv from 'dotenv';
import measureRoutes from './routes/measure.route';

dotenv.config();

export function startServer() {
  const app = express();
  const PORT = process.env.PORT || 8080;

  app.use(express.json());

  app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
  });

  app.use('/api/measures', measureRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
