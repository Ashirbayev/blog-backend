import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './config/data-source';
import dotenv from 'dotenv';
dotenv.config(); // Загружает переменные из .env в process.env

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to database
AppDataSource.initialize()
    .then(() => console.log('Database connected'))
    .catch((error) => console.error('Database connection error:', error));

export default app;
