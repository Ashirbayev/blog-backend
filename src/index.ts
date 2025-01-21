import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './config/data-source'; // Подключение к базе данных
import userRoutes from './routes/userRoutes';
import blogRoutes from './routes/blogRoutes';  // Маршруты для постов
import authMiddleware from './middlewares/authMiddleware';  // Middleware для авторизации

const app = express();
const PORT =  3000;

app.use(bodyParser.json());
app.use(require('cors')())

console.log(888)
// Маршруты для пользователей (не защищены)
app.use('/api/users', userRoutes);
console.log(666)
// Защищенные маршруты для работы с постами
app.use('/api/posts',  blogRoutes); // Защищаем только /posts маршруты

// Инициализация базы данных и запуск сервера
AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error: any) => {
        console.error('Error during database initialization:', error);
    });
