import { Router, Request, Response } from 'express';
import { prisma } from '../../services/prisma';
import { authenticate } from '../../middleware/auth.middleware';
import logger from '../../services/logger';

const router = Router();

// Middleware to check if user is admin
const checkAdmin = (req: Request, res: Response, next: Function) => {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
    if (!req.user || !adminEmails.includes(req.user.email)) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// ==================== ADMIN ROUTES ====================

// Get all testimonials (for admin)
router.get('/', authenticate, checkAdmin, async (req: Request, res: Response) => {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(testimonials);
    } catch (error) {
        logger.error('Failed to fetch testimonials:', error);
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
});

// Create new testimonial
router.post('/', authenticate, checkAdmin, async (req: Request, res: Response) => {
    try {
        const { name, location, experience, rating, review, avatar } = req.body;

        const testimonial = await prisma.testimonial.create({
            data: {
                name,
                location,
                experience,
                rating: rating || 5,
                review,
                avatar,
                isApproved: false,
                isFeatured: false
            }
        });

        logger.info('Testimonial created', { id: testimonial.id, userId: req.user?.userId });
        res.json(testimonial);
    } catch (error) {
        logger.error('Failed to create testimonial:', error);
        res.status(500).json({ error: 'Failed to create testimonial' });
    }
});

// Update testimonial
router.put('/:id', authenticate, checkAdmin, async (req: Request, res: Response) => {
    try {
        const { name, location, experience, rating, review, avatar } = req.body;

        const testimonial = await prisma.testimonial.update({
            where: { id: req.params.id },
            data: {
                name,
                location,
                experience,
                rating,
                review,
                avatar
            }
        });

        logger.info('Testimonial updated', { id: testimonial.id, userId: req.user?.userId });
        res.json(testimonial);
    } catch (error: any) {
        logger.error('Failed to update testimonial:', error);
        res.status(500).json({ error: 'Failed to update testimonial' });
    }
});

// Delete testimonial
router.delete('/:id', authenticate, checkAdmin, async (req: Request, res: Response) => {
    try {
        await prisma.testimonial.delete({
            where: { id: req.params.id }
        });

        logger.info('Testimonial deleted', { id: req.params.id, userId: req.user?.userId });
        res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        logger.error('Failed to delete testimonial:', error);
        res.status(500).json({ error: 'Failed to delete testimonial' });
    }
});

// Toggle approved status
router.put('/:id/approve', authenticate, checkAdmin, async (req: Request, res: Response) => {
    try {
        const testimonial = await prisma.testimonial.findUnique({
            where: { id: req.params.id }
        });

        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        const updated = await prisma.testimonial.update({
            where: { id: req.params.id },
            data: {
                isApproved: !testimonial.isApproved
            }
        });

        logger.info('Testimonial approval toggled', {
            id: updated.id,
            isApproved: updated.isApproved,
            userId: req.user?.userId
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
        const testimonial = await prisma.testimonial.findUnique({
            where: { id: req.params.id }
        });

        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        const updated = await prisma.testimonial.update({
            where: { id: req.params.id },
            data: {
                isFeatured: !testimonial.isFeatured
            }
        });

        logger.info('Testimonial featured status toggled', {
            id: updated.id,
            isFeatured: updated.isFeatured,
            userId: req.user?.userId
        });
        res.json(updated);
    } catch (error) {
        logger.error('Failed to toggle featured status:', error);
        res.status(500).json({ error: 'Failed to toggle featured status' });
    }
});

export default router;
