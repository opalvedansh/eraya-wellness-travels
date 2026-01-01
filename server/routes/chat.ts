import type { Request, Response } from "express";
import { getChatCompletion } from "../services/gemini.service";
import logger from "../services/logger";

export async function handleChat(req: Request, res: Response) {
    try {
        const { message } = req.body as { message: string };

        logger.info("Chat request received", {
            messageLength: message.length,
            ip: req.ip,
        });

        // Call OpenAI service
        const aiResponse = await getChatCompletion(message);

        logger.info("Chat response generated", {
            responseLength: aiResponse.length,
        });

        // Return AI response
        res.json({
            reply: aiResponse,
            success: true,
        });
    } catch (error) {
        logger.error("Error in chat handler", {
            error: error instanceof Error ? error.message : String(error),
        });

        // Return user-friendly error message
        const errorMessage =
            error instanceof Error
                ? error.message
                : "Failed to process your message. Please try again.";

        res.status(500).json({
            error: errorMessage,
            success: false,
        });
    }
}
