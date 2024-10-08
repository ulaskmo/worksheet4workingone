import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './database';
import userRoutes from './routes/users';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1/users', userRoutes);

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start server due to database connection error:', error);
});
