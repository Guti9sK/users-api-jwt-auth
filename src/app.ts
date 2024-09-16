import dotenv from "dotenv";
import express from "express";
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
dotenv.config();

export const app = express();
app.use(express.json());

// Rutas
// autenticación
app.use('/auth', authRoutes);
// usuario
app.use('/users', userRoutes);
