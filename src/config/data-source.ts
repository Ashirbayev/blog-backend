import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'blog_user',
    password: process.env.DB_PASSWORD || 'Astana2025',
    database: process.env.DB_NAME || 'blog',
    synchronize: true, // Отключите на продакшене
    logging: false,
    entities: ['./src/entities/*.ts'],
});
