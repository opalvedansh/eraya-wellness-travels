import { Router, Request, Response } from 'express';
import { prisma } from '../services/prisma';
import logger from '../services/logger';

const router = Router();

// Get approved transformationStorys for public website
router.get('/', async (req: Request, res: Response) => {
    try {
        const { featured } = req.query;

        const where: any = {
            isApproved: true
        };

        // If featured=true, only get featured transformationStorys
        if (featured === 'true') {
            where.isFeatured = true;
        }

        const transformationStorys = await prisma.transformationStory.findMany({
            where,
            orderBy: [
                { isFeatured: 'desc' }, // Featured first
                { createdAt: 'desc' }
            ],
            select: {
                id: true,
                name: true,
                location: true,
                experience: true,
                rating: true,
                review: true,
                avatar: true,
                createdAt: true
            }
        });

        res.json(transformationStorys);
    } catch (error) {
        logger.error('Failed to fetch transformationStorys:', error);
        res.status(500).json({ error: 'Failed to fetch transformationStorys' });
    }
});

export default router;
