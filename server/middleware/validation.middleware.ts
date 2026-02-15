import { RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";
import logger from "../services/logger";

/**
 * Middleware to validate request body against a Zod schema
 */
export function validateRequest(schema: ZodSchema): RequestHandler {
    return (req, res, next) => {
        try {
            // Validate and parse the request body
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod validation errors
                const errors = error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));

                logger.warn("Validation failed", { errors, path: req.path });

                return res.status(400).json({
                    error: "Validation failed",
                    details: errors,
                });
            }

            // Unexpected error
            logger.error("Validation middleware error", {
                error: error instanceof Error ? error.message : String(error),
                path: req.path,
            });

            return res.status(500).json({
                error: "Internal server error",
            });
        }
    };
}
