import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma';
import logger from '../services/logger';

const router = Router();

// Middleware to check if user is authenticated
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    (req as any).userId = userId;
    next();
};

// GET /api/profile - Get current user profile data
router.get('/', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                photoURL: true,
                createdAt: true,
                _count: {
                    select: {
                        bookings: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get booking statistics
        const bookings = await prisma.booking.findMany({
            where: { userId },
            select: {
                status: true,
                price: true,
                location: true,
            },
        });

        const stats = {
            totalBookings: bookings.length,
            upcomingBookings: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
            totalSpent: bookings.reduce((sum, b) => sum + b.price, 0),
            countriesVisited: new Set(bookings.map(b => b.location)).size,
        };

        res.json({
            ...user,
            stats,
        });
    } catch (error) {
        logger.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// PATCH /api/profile - Update user profile information
router.patch('/', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { name, photoURL } = req.body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (photoURL !== undefined) updateData.photoURL = photoURL;

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                photoURL: true,
                createdAt: true,
            },
        });

        res.json(user);
    } catch (error) {
        logger.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;
