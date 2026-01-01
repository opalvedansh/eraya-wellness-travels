import { Router, Request, Response } from "express";
import { prisma } from "../services/prisma";
import logger from "../services/logger";

const router = Router();

/**
 * Get a specific setting value (public - for frontend to check)
 * GET /api/settings/:key
 */
router.get("/:key", async (req: Request, res: Response) => {
    try {
        const { key } = req.params;

        const setting = await prisma.siteSettings.findUnique({
            where: { key },
        });

        if (!setting) {
            // Return default values for common settings
            const defaults: Record<string, boolean> = {
                payments_enabled: false,
                maintenance_mode: false,
                booking_enabled: true,
                show_prices: true,
            };

            return res.json({
                key,
                value: defaults[key] !== undefined ? defaults[key] : false
            });
        }

        // Parse JSON value
        const value = JSON.parse(setting.value);

        res.json({ key, value });
    } catch (error) {
        logger.error("Error fetching setting", { error });
        res.status(500).json({ error: "Failed to fetch setting" });
    }
});

/**
 * Get all settings (public - for frontend checks)
 * GET /api/settings
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const settings = await prisma.siteSettings.findMany();

        // Convert to key-value object
        const settingsObject: Record<string, any> = {};
        settings.forEach((setting) => {
            try {
                settingsObject[setting.key] = JSON.parse(setting.value);
            } catch {
                settingsObject[setting.key] = setting.value;
            }
        });

        // Add defaults if not found
        const defaults = {
            payments_enabled: false,
            maintenance_mode: false,
            booking_enabled: true,
            show_prices: true,
        };

        const result = { ...defaults, ...settingsObject };
        res.json(result);
    } catch (error) {
        logger.error("Error fetching settings", { error });
        res.status(500).json({ error: "Failed to fetch settings" });
    }
});

export default router;
