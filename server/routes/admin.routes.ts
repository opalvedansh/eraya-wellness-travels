import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../services/prisma";
import { authenticate } from "../middleware/auth.middleware";
import logger from "../services/logger";

const router = Router();

// Middleware to check if user is admin
async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user;

        if (!user || !user.userId) {
            logger.warn("Unauthorized admin access attempt - no user ID", { user });
            return res.status(401).json({ error: "Not authenticated" });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.userId },
            select: { isAdmin: true },
        });

        if (!dbUser?.isAdmin) {
            logger.warn("Unauthorized admin access attempt", { userId: user.userId });
            return res.status(403).json({ error: "Admin access required" });
        }

        next();
    } catch (error) {
        logger.error("Admin middleware error", { error });
        res.status(500).json({ error: "Failed to verify admin status" });
    }
}

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// ==================== DASHBOARD ====================

router.get("/dashboard/stats", async (req: Request, res: Response) => {
    try {
        const [
            totalTours,
            totalTreks,
            totalBookings,
            pendingBookings,
            recentBookings,
        ] = await Promise.all([
            prisma.tour.count({ where: { isActive: true } }),
            prisma.trek.count({ where: { isActive: true } }),
            prisma.booking.count(),
            prisma.booking.count({ where: { status: "pending" } }),
            prisma.booking.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    itemName: true,
                    fullName: true,
                    email: true,
                    amount: true,
                    status: true,
                    createdAt: true,
                },
            }),
        ]);

        res.json({
            stats: {
                totalTours,
                totalTreks,
                totalBookings,
                pendingBookings,
            },
            recentBookings,
        });
    } catch (error) {
        logger.error("Failed to fetch dashboard stats", { error });
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
});

// ==================== TOURS ====================

// Get all tours
router.get("/tours", async (req: Request, res: Response) => {
    try {
        const tours = await prisma.tour.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(tours);
    } catch (error) {
        logger.error("Failed to fetch tours", { error });
        res.status(500).json({ error: "Failed to fetch tours" });
    }
});

// Get single tour
router.get("/tours/:id", async (req: Request, res: Response) => {
    try {
        const tour = await prisma.tour.findUnique({
            where: { id: req.params.id },
        });

        if (!tour) {
            return res.status(404).json({ error: "Tour not found" });
        }

        res.json(tour);
    } catch (error) {
        logger.error("Failed to fetch tour", { error });
        res.status(500).json({ error: "Failed to fetch tour" });
    }
});

// Create tour
router.post("/tours", async (req: Request, res: Response) => {
    try {
        const tour = await prisma.tour.create({
            data: req.body,
        });

        logger.info("Tour created", { tourId: tour.id, userId: req.user?.userId });
        res.json(tour);
    } catch (error) {
        logger.error("Failed to create tour", { error });
        res.status(500).json({ error: "Failed to create tour" });
    }
});

// Update tour
router.put("/tours/:id", async (req: Request, res: Response) => {
    try {
        const tour = await prisma.tour.update({
            where: { id: req.params.id },
            data: req.body,
        });

        logger.info("Tour updated", { tourId: tour.id, userId: req.user?.userId });
        res.json(tour);
    } catch (error) {
        logger.error("Failed to update tour", { error });
        res.status(500).json({ error: "Failed to update tour" });
    }
});

// Delete tour
router.delete("/tours/:id", async (req: Request, res: Response) => {
    try {
        await prisma.tour.delete({
            where: { id: req.params.id },
        });

        logger.info("Tour deleted", { tourId: req.params.id, userId: req.user?.userId });
        res.json({ message: "Tour deleted successfully" });
    } catch (error) {
        logger.error("Failed to delete tour", { error });
        res.status(500).json({ error: "Failed to delete tour" });
    }
});

// ==================== TREKS ====================

// Get all treks
router.get("/treks", async (req: Request, res: Response) => {
    try {
        const treks = await prisma.trek.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(treks);
    } catch (error) {
        logger.error("Failed to fetch treks", { error });
        res.status(500).json({ error: "Failed to fetch treks" });
    }
});

// Get single trek
router.get("/treks/:id", async (req: Request, res: Response) => {
    try {
        const trek = await prisma.trek.findUnique({
            where: { id: req.params.id },
        });

        if (!trek) {
            return res.status(404).json({ error: "Trek not found" });
        }

        res.json(trek);
    } catch (error) {
        logger.error("Failed to fetch trek", { error });
        res.status(500).json({ error: "Failed to fetch trek" });
    }
});

// Create trek
router.post("/treks", async (req: Request, res: Response) => {
    try {
        const trek = await prisma.trek.create({
            data: req.body,
        });

        logger.info("Trek created", { trekId: trek.id, userId: req.user?.userId });
        res.status(201).json(trek);
    } catch (error) {
        logger.error("Failed to create trek", { error });

        if (error.code === 'P2002') {
            return res.status(400).json({ error: "A trek with this slug or name already exists" });
        }

        res.status(500).json({ error: "Failed to create trek", details: error.message });
    }
});

// Update trek
router.put("/treks/:id", async (req: Request, res: Response) => {
    try {
        const trek = await prisma.trek.update({
            where: { id: req.params.id },
            data: req.body,
        });

        logger.info("Trek updated", { trekId: trek.id, userId: req.user?.userId });
        res.json(trek);
    } catch (error) {
        logger.error("Failed to update trek", { error });
        res.status(500).json({ error: "Failed to update trek" });
    }
});

// Delete trek
router.delete("/treks/:id", async (req: Request, res: Response) => {
    try {
        await prisma.trek.delete({
            where: { id: req.params.id },
        });

        logger.info("Trek deleted", { trekId: req.params.id, userId: req.user?.userId });
        res.json({ message: "Trek deleted successfully" });
    } catch (error) {
        logger.error("Failed to delete trek", { error });
        res.status(500).json({ error: "Failed to delete trek" });
    }
});

// ==================== BOOKINGS ====================

// Get all bookings
router.get("/bookings", async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(bookings);
    } catch (error) {
        logger.error("Failed to fetch bookings", { error });
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

// Update booking status
router.put("/bookings/:id/status", async (req: Request, res: Response) => {
    try {
        const { status } = req.body;

        const booking = await prisma.booking.update({
            where: { id: req.params.id },
            data: { status },
        });

        logger.info("Booking status updated", {
            bookingId: booking.id,
            newStatus: status,
            userId: req.user?.userId
        });

        res.json(booking);
    } catch (error) {
        logger.error("Failed to update booking status", { error });
        res.status(500).json({ error: "Failed to update booking status" });
    }
});

// ==================== SETTINGS ====================

// Get all settings
router.get("/settings", async (req: Request, res: Response) => {
    try {
        const settings = await prisma.siteSettings.findMany();

        // Convert to key-value format
        const settingsMap = settings.reduce((acc, setting) => {
            acc[setting.key] = JSON.parse(setting.value);
            return acc;
        }, {} as Record<string, any>);

        res.json(settingsMap);
    } catch (error) {
        logger.error("Failed to fetch settings", { error });
        res.status(500).json({ error: "Failed to fetch settings" });
    }
});

// Update setting
router.put("/settings/:key", async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const { value, description } = req.body;

        if (!value) {
            logger.warn("Attempt to update setting with empty value", { key });
            return res.status(400).json({ error: "Value is required" });
        }

        const setting = await prisma.siteSettings.upsert({
            where: { key },
            create: {
                key,
                value: JSON.stringify(value),
                description,
            },
            update: {
                value: JSON.stringify(value),
                description,
            },
        });

        logger.info("Setting updated", {
            key,
            userId: req.user?.userId
        });

        res.json({ key: setting.key, value: JSON.parse(setting.value) });
    } catch (error) {
        logger.error("Failed to update setting", { error });
        res.status(500).json({ error: "Failed to update setting" });
    }
});

export default router;
