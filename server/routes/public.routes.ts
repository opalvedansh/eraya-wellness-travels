import express, { Request, Response } from "express";
import { prisma } from "../services/prisma";
import logger from "../services/logger";

const router = express.Router();

// ==================== TOURS ====================

// Get all active tours
router.get("/tours", async (req: Request, res: Response) => {
    try {
        const tours = await prisma.tour.findMany({
            where: { isActive: true },
            orderBy: [
                { isFeatured: "desc" },
                { createdAt: "desc" }
            ],
        });
        res.json(tours);
    } catch (error) {
        logger.error("Failed to fetch tours", { error });
        res.status(500).json({ error: "Failed to fetch tours" });
    }
});

// Get single tour by slug
router.get("/tours/:slug", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
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

        res.json(tour);
    } catch (error) {
        logger.error("Failed to fetch tour", { slug: req.params.slug, error });
        res.status(500).json({ error: "Failed to fetch tour" });
    }
});

// ==================== TREKS ====================

// Get all active treks
router.get("/treks", async (req: Request, res: Response) => {
    try {
        const treks = await prisma.trek.findMany({
            where: { isActive: true },
            orderBy: [
                { isFeatured: "desc" },
                { createdAt: "desc" }
            ],
        });
        res.json(treks);
    } catch (error) {
        logger.error("Failed to fetch treks", { error });
        res.status(500).json({ error: "Failed to fetch treks" });
    }
});

// Get single trek by slug
router.get("/treks/:slug", async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
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

        res.json(trek);
    } catch (error) {
        logger.error("Failed to fetch trek", { slug: req.params.slug, error });
        res.status(500).json({ error: "Failed to fetch trek" });
    }
});

export default router;
