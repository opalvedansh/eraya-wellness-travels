import express, { Request, Response } from "express";
import { prisma } from "../services/prisma";
import logger from "../services/logger";

const router = express.Router();

// Get public content settings (e.g. about page)
router.get("/:key", async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const setting = await prisma.siteSettings.findUnique({
            where: { key },
        });

        if (!setting) {
            // Return null instead of 404 so frontend can fallback to default content easily
            return res.json(null);
        }

        res.json(JSON.parse(setting.value));
    } catch (error) {
        logger.error("Failed to fetch content setting", { key: req.params.key, error });
        res.status(500).json({ error: "Failed to fetch content" });
    }
});

export default router;
