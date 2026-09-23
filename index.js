  import express from 'express';
  import authRouter from './routes/authRoutes.js';
  import connectDB from './config/connectDB.js';
  import dotenv from 'dotenv';
  import productRouter from './routes/productRoutes.js';
  import cors from 'cors';

  dotenv.config();

  const app = express();

  const PORT = process.env.PORT || 5000;


  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static('uploads'));


  connectDB();

  app.use('/api/auth', authRouter);
  app.use('/api/products', productRouter);


  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });




  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });