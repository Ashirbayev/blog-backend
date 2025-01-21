import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // Замените на ваш секретный ключ

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    console.log(8888);
    let gtt: any = req
    // Извлечение токена из заголовка Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return; // Завершаем выполнение, чтобы избежать выполнения следующего кода
    }

    try {
        // Верификация токена
        const decoded = jwt.verify(token, JWT_SECRET);

        // Если нужно, добавьте данные пользователя в запрос
        gtt.user = decoded;

        next(); // Продолжаем выполнение маршрута
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authMiddleware;
