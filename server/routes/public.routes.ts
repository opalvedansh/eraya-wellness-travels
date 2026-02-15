import { Router, Request, Response } from "express";
import { prisma } from "../services/prisma";
import logger from "../services/logger";

const router = Router();

// ==================== TOURS ====================

// Get all active tours (Optimized: Select only needed fields)
router.get("/tours", async (req: Request, res: Response) => {
    try {
        const tours = await prisma.tour.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                slug: true,
                location: true,
                price: true,
                duration: true,
                difficulty: true,
                rating: true,
                coverImage: true,
                images: true, // Needed for fallback if coverImage is missing
                latitude: true,
                longitude: true,
                tags: true,
                isFeatured: true,
                createdAt: true, // Used for sorting if needed
                maxGroupSize: true, // displayed in card
                // vibe: true, // displayed in card (if exists in model, but schema says no 'vibe' field, it is computed in frontend maybe? Checking schema: Tour model doesn't have 'vibe', frontend adds it. Wait, Tour.tsx uses `vibe` property on Tour interface. Let's check schema again. Schema does NOT have vibe. It has difficulty, rating. Frontend defaults vibe to "Cultural Tour".)
                // highlights: true, // Used in QuickView? Yes. Let's keep highlights for now as it's useful for preview.
            },
            orderBy: [
                { isFeatured: "desc" },
                { createdAt: "desc" }
            ],
        });

        // Enable caching (removed no-store)
        res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
        res.json(tours);
    } catch (error) {
        logger.error("Failed to fetch tours", { error });

        // Return more specific error for debugging
        if (error instanceof Error) {
            res.status(500).json({
                error: "Failed to fetch tours",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        } else {
            res.status(500).json({ error: "Failed to fetch tours" });
        }
    }
});

// Get single tour by slug (Fetch everything including heavy fields)
router.get("/tours/:slug", async (req: Request, res: Response) => {
    try {
        const slug = req.params.slug as string;
        const tour = await prisma.tour.findUnique({
            where: { slug },
        });

        if (!tour) {
            return res.status(404).json({ error: "Tour not found" });
        }

        // Only return if active (or allow viewing inactive for admin preview)
        if (!tour.isActive) {
            return res.status(404).json({ error: "Tour not found" });
        }

        // Enable short caching
        res.setHeader('Cache-Control', 'public, max-age=60'); // 1 minute
        res.json(tour);
    } catch (error) {
        logger.error("Failed to fetch tour", { slug: req.params.slug as string, error });
        res.status(500).json({ error: "Failed to fetch tour" });
    }
});

// ==================== TREKS ====================

// Get all active treks (Optimized)
router.get("/treks", async (req: Request, res: Response) => {
    try {
        const treks = await prisma.trek.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                slug: true,
                location: true,
                price: true,
                duration: true,
                difficulty: true,
                rating: true,
                coverImage: true,
                images: true,
                latitude: true,
                longitude: true,
                tags: true,
                isFeatured: true,
                createdAt: true,
                maxGroupSize: true,
                // highlights: true,
            },
            orderBy: [
                { isFeatured: "desc" },
                { createdAt: "desc" }
            ],
        });

        // Enable caching
        res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
        res.json(treks);
    } catch (error) {
        logger.error("Failed to fetch treks", { error });

        // Return more specific error for debugging
        if (error instanceof Error) {
            res.status(500).json({
                error: "Failed to fetch treks",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        } else {
            res.status(500).json({ error: "Failed to fetch treks" });
        }
    }
});

// Get single trek by slug
router.get("/treks/:slug", async (req: Request, res: Response) => {
    try {
        const slug = req.params.slug as string;
        const trek = await prisma.trek.findUnique({
            where: { slug },
        });

        if (!trek) {
            return res.status(404).json({ error: "Trek not found" });
        }

        // Only return if active (or allow viewing inactive for admin preview)
        if (!trek.isActive) {
            return res.status(404).json({ error: "Trek not found" });
        }

        // Enable short caching
        res.setHeader('Cache-Control', 'public, max-age=60');
        res.json(trek);
    } catch (error) {
        logger.error("Failed to fetch trek", { slug: req.params.slug as string, error });
        res.status(500).json({ error: "Failed to fetch trek" });
    }
});

export default router;
