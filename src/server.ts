import express from 'express';
import dotenv from 'dotenv';
import measureRoutes from './routes/measure.route';

dotenv.config();

export function startServer() {
  const app = express();
  const PORT = process.env.PORT || 80;

  app.use(express.json());
  app.use('/api', measureRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
