import { Router, Request, Response } from 'express';
import { prisma } from '../../services/prisma';
import { authenticate } from '../../middleware/auth.middleware';
import logger from '../../services/logger';

const router = Router();

// Middleware to check if user is admin
const checkAdmin = async (req: Request, res: Response, next: any) => {
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
    const userEmail = (req as any).user?.email;

    if (!adminEmails.includes(userEmail)) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Get all transformation stories (admin view)
router.get('/', authenticate, checkAdmin, async (req: Request, res: Response) => {
    try {
        const stories = await prisma.transformationStory.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(stories);
    } catch (error) {
        logger.error('Failed to fetch transformation stories:', error);
        res.status(500).json({ error: 'Failed to fetch transformation stories' });
    }
});

// Create new transformation story
router.post('/', authenticate, checkAdmin, async (req: Request, res: Response) => {
    try {
        const { name, age, location, storyTitle, story, avatar } = req.body;

        const newStory = await prisma.transformationStory.create({
            data: {
                name,
                age: String(age),
                location,
                storyTitle,
                story,
                avatar: avatar || '',
                isApproved: false,
                isFeatured: false,
            }
        });

        res.json(newStory);
    } catch (error) {
        logger.error('Failed to create transformation story:', error);
        res.status(500).json({ error: 'Failed to create transformation story' });
    }
});

// Update transformation story
router.put('/:id', authenticate, checkAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, age, location, storyTitle, story, avatar } = req.body;

        const updated = await prisma.transformationStory.update({
            where: { id },
            data: {
                name,
                age: String(age),
                location,
                storyTitle,
                story,
                avatar: avatar || '',
            }
        });

        res.json(updated);
    } catch (error) {
        logger.error('Failed to update transformation story:', error);
        res.status(500).json({ error: 'Failed to update transformation story' });
    }
});

// Delete transformation story
router.delete('/:id', authenticate, checkAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.transformationStory.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        logger.error('Failed to delete transformation story:', error);
        res.status(500).json({ error: 'Failed to delete transformation story' });
    }
});

// Toggle approval status
router.put('/:id/approve', authenticate, checkAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const story = await prisma.transformationStory.findUnique({ where: { id } });

        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        const updated = await prisma.transformationStory.update({
            where: { id },
            data: { isApproved: !story.isApproved }
        });

        res.json(updated);
    } catch (error) {
        logger.error('Failed to toggle approval:', error);
        res.status(500).json({ error: 'Failed to toggle approval' });
    }
});

// Toggle featured status
router.put('/:id/feature', authenticate, checkAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const story = await prisma.transformationStory.findUnique({ where: { id } });

        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        const updated = await prisma.transformationStory.update({
            where: { id },
            data: { isFeatured: !story.isFeatured }
        });

        res.json(updated);
    } catch (error) {
        logger.error('Failed to toggle featured:', error);
        res.status(500).json({ error: 'Failed to toggle featured' });
    }
});

export default router;
