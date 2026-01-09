import { Router, Request, Response } from 'express';
import { prisma } from '../services/prisma';
import logger from '../services/logger';

const router = Router();

// Get approved transformation stories for public website
router.get('/', async (req: Request, res: Response) => {
    try {
        const { featured } = req.query;

        const where: any = {
            isApproved: true
        };

        // If featured=true, only get featured stories
        if (featured === 'true') {
            where.isFeatured = true;
        }

        // DEBUG: Log counts to diagnosis issue
        const totalCount = await prisma.transformationStory.count();
        const approvedCount = await prisma.transformationStory.count({ where: { isApproved: true } });
        logger.info(`Transformation Story Debug: Total=${totalCount}, Approved=${approvedCount}, Querying with featured=${featured}`);

        const stories = await prisma.transformationStory.findMany({
            where,
            orderBy: [
                { isFeatured: 'desc' }, // Featured first
                { createdAt: 'desc' }
            ],
            select: {
                id: true,
                name: true,
                age: true,
                location: true,
                storyTitle: true,
                story: true,
                avatar: true,
                createdAt: true,
                isApproved: true // Select this just to verify in logs
            }
        });

        logger.info(`Transformation stories found: ${stories.length}`);
        res.json(stories);
    } catch (error) {
        logger.error('Failed to fetch transformation stories:', error);
        res.status(500).json({ error: 'Failed to fetch transformation stories' });
    }
});

export default router;
