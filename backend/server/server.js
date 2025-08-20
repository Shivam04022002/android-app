
import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import applicationRoutes from './routes/applicationRoutes.js';
import authRoutes from './routes/authRoutes.js';



const app = express();

// ✅ Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cors());

const allowedOrigins = ["http://localhost:8081",
  "http://localhost:3000",  
  "http://192.168.1.126:8081",];
app.use(cors({      
  origin: true,
  credentials: true,
}));

// Routes
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);

connectDB();


app.listen(5000, () => {
  console.log("✅ Server is running on port 5000");
});