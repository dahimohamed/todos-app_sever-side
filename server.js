import express from 'express';
import cors from 'cors';
import { router as todoRouter } from './src/routes/todoRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use('/todos', express.json(), todoRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
