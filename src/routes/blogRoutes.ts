import { Router } from 'express';
import { BlogPost } from '../entities/BlogPost';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Request, Response } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
const express = require('express')

const router = express.Router()


router.get('/posts', authMiddleware, async function (_req: Request, res: Response)  {
    console.log('dasd')
    try {
        const posts = await AppDataSource.getRepository(BlogPost).find({ relations: ['author'] });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts', error });
    }
});


// Получение поста по ID
router.get('/posts/:id', authMiddleware, async function (req: Request, res: Response) {
    const { id } = req.params; // Получаем ID из параметров URL
    try {
        const post = await AppDataSource.getRepository(BlogPost)
            .findOne({ where: { id: parseInt(id) }, relations: ['author'] });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post); // Отправляем найденный пост
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch post', error });
    }
});


// Создать новый пост
router.post('/posts', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { message, media, authorId } = req.body;

        if (!message || !authorId) {
            return res.status(400).json({ message: 'Message and authorId are required' });
        }

        const author = await AppDataSource.getRepository(User).findOneBy({ id: authorId });

        if (!author) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPost = AppDataSource.getRepository(BlogPost).create({
            message,
            media,
            author,
        });

        await AppDataSource.getRepository(BlogPost).save(newPost);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create post', error });
    }
});

// Обновить пост
router.put('/posts/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { message, media } = req.body;

        const post = await AppDataSource.getRepository(BlogPost).findOneBy({ id: +id });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.message = message ?? post.message;
        post.media = media ?? post.media;

        await AppDataSource.getRepository(BlogPost).save(post);

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update post', error });
    }
});

// Удалить пост
router.delete('/posts/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const post = await AppDataSource.getRepository(BlogPost).findOneBy({ id: +id });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await AppDataSource.getRepository(BlogPost).remove(post);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete post', error });
    }
});

export default router;
