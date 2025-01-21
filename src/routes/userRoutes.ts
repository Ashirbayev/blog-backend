
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Router, Request, Response } from 'express';
const express = require('express')

const router = express.Router()


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';



// Регистрация пользователя
router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const userRepository = AppDataSource.getRepository(User);

    try {
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({ email, password: hashedPassword });
        await userRepository.save(user);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});
// Авторизация пользователя
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Ищем пользователя по email
        const user = await AppDataSource.getRepository(User).findOneBy({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Генерируем токен
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // Возвращаем токен, id и email
        return res.json({
            token,
            id: user.id,
            email: user.email,
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});


export default router;
