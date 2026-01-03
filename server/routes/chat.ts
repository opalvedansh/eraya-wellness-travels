import { Request, Response } from "express";
import { getChatCompletion } from "../services/gemini.service";
import logger from "../services/logger";
import { z } from "zod";

export const handleChat = async (req: Request, res: Response) => {
    const { message } = req.body;

    // Rate limiting context
    const userId = (req as any).userId || "anonymous";
    const ipAddress = req.ip || "unknown";

    try {
        // Validate input
        const chatSchema = z.object({
            message: z.string().min(1).max(500),
        });

        chatSchema.parse({ message });

        const reply = await getChatCompletion(message);
        res.json({ reply });
    } catch (error) {
        if (error instanceof z.ZodError) {
            logger.warn("Invalid chat message format", { userId, error: error.errors });
            return res.status(400).json({
                error: "Invalid message format",
                details: error.errors,
            });
        }

        logger.error("Chat error", {
            error: error instanceof Error ? error.message : String(error),
            userId,
            ipAddress,
        });

        res.status(500).json({ error: "Failed to process chat message" });
    }
};
