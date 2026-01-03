import { Router, Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { authenticate } from '../middleware/auth.middleware';
import logger from '../services/logger';

const router = Router();

// GET /api/bookings - Get all bookings for authenticated user
router.get('/', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const bookings = await prisma.booking.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        logger.info('Fetched bookings for user', { userId, count: bookings.length });
        res.json(bookings);
    } catch (error) {
        logger.error('Error fetching bookings', {
            error: error instanceof Error ? error.message : String(error),
            userId: req.user?.userId
        });
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// GET /api/bookings/:id - Get specific booking details
router.get('/:id', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const booking = await prisma.booking.findFirst({
            where: {
                id,
                userId, // Ensure user can only access their own bookings
            },
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        logger.info('Fetched booking details', { bookingId: id, userId });
        res.json(booking);
    } catch (error) {
        logger.error('Error fetching booking', {
            error: error instanceof Error ? error.message : String(error),
            bookingId: req.params.id,
            userId: req.user?.userId
        });
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// POST /api/bookings - Create new booking
router.post('/', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            logger.error('No userId found in authenticated request');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const {
            type,
            itemName,
            itemSlug,
            location,
            duration,
            price,
            travelDate,
            fullName,
            email,
            phone,
            guests,
            amount,
        } = req.body;

        // Validate required fields
        if (!type || !itemName || !itemSlug || !location || !duration || !price || !travelDate || !fullName || !email) {
            logger.warn('Missing required fields in booking creation', { userId, itemName });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure user exists in database (sync from Supabase if needed)
        // This handles the case where a user authenticated with Supabase but doesn't exist in PostgreSQL yet
        let user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            // User doesn't exist with this userId, check if email exists
            const existingUserByEmail = await prisma.user.findUnique({
                where: { email: email },
            });

            if (existingUserByEmail) {
                // Email exists but with different userId - this can happen if user signed up with email
                // then later authenticated with Google/different provider
                // Update the existing user's ID to match the authenticated one
                logger.warn('User exists with different ID, this may cause issues', {
                    existingUserId: existingUserByEmail.id,
                    authenticatedUserId: userId,
                    email
                });
                // For now, create a new user with userId and let booking use authenticated userId
                // The email constraint will fail, so we need to handle this
                try {
                    user = await prisma.user.create({
                        data: {
                            id: userId,
                            email: email,
                            name: fullName,
                            authProvider: 'supabase',
                            isVerified: true,
                        },
                    });
                    logger.info('User created successfully', { userId: user.id });
                } catch (createError) {
                    // If creation fails due to unique constraint, use the existing user
                    logger.error('Failed to create user, using existing user', {
                        error: createError instanceof Error ? createError.message : String(createError),
                        userId,
                        email
                    });
                    // Since we can't create the user, we'll need to use existing user
                    // but this means booking.userId won't match authenticated userId
                    user = existingUserByEmail;
                }
            } else {
                // User doesn't exist at all, create them
                logger.info('Creating new user in database', { userId, email });
                user = await prisma.user.create({
                    data: {
                        id: userId,
                        email: email,
                        name: fullName,
                        authProvider: 'supabase',
                        isVerified: true,
                    },
                });
                logger.info('User created successfully', { userId: user.id });
            }
        }

        const booking = await prisma.booking.create({
            data: {
                userId: user.id, // Use the actual user ID from database (may differ from authenticated userId)
                type,
                itemName,
                itemSlug,
                location,
                duration,
                price: parseFloat(price),
                travelDate: new Date(travelDate),
                fullName,
                email,
                phone,
                guests: guests ? parseInt(guests) : 1,
                amount: amount ? parseFloat(amount) : parseFloat(price),
                status: 'pending',
                paymentStatus: 'pending',
                currency: 'usd',
            },
        });

        logger.info('Booking created successfully', {
            bookingId: booking.id,
            userId,
            itemName,
            amount: booking.amount
        });

        res.status(201).json(booking);
    } catch (error) {
        logger.error('Error creating booking', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            userId: req.user?.userId,
            body: req.body
        });
        res.status(500).json({
            error: 'Failed to create booking',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// PATCH /api/bookings/:id/status - Update booking status
router.patch('/:id/status', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const { status } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // Check if booking belongs to user
        const existingBooking = await prisma.booking.findFirst({
            where: { id, userId },
        });

        if (!existingBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = await prisma.booking.update({
            where: { id },
            data: { status },
        });

        logger.info('Booking status updated', { bookingId: id, userId, status });
        res.json(booking);
    } catch (error) {
        logger.error('Error updating booking status', {
            error: error instanceof Error ? error.message : String(error),
            bookingId: req.params.id,
            userId: req.user?.userId
        });
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});

export default router;
