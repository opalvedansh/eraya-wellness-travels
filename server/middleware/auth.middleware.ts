import { RequestHandler } from "express";
import { verifyToken } from "../services/jwt";
import logger from "../services/logger";

// Extend Express Request to include user data
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                sessionId: string;
            };
        }
    }
}

/**
 * Middleware to authenticate requests using JWT tokens
 * Expects token in Authorization header: "Bearer <token>"
 */
export const authenticate: RequestHandler = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.warn("Missing or invalid authorization header", { path: req.path });
            return res.status(401).json({
                error: "Authentication required",
                message: "Please provide a valid token in the Authorization header",
            });
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix

        const decoded = await verifyToken(token);

        if (!decoded) {
            logger.warn("Invalid or expired token", { path: req.path });
            return res.status(401).json({
                error: "Invalid or expired token",
                message: "Please log in again",
            });
        }

        // Attach user data to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            sessionId: decoded.sessionId,
        };

        logger.debug("User authenticated", { userId: decoded.userId, path: req.path });
        next();
    } catch (error) {
        logger.error("Authentication middleware error", {
            error: error instanceof Error ? error.message : String(error),
            path: req.path,
        });

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

/**
 * Optional authentication - doesn't fail if no token provided
 * But validates token if present
 */
export const optionalAuthenticate: RequestHandler = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            // No token provided, continue without user data
            return next();
        }

        const token = authHeader.substring(7);
        const decoded = await verifyToken(token);

        if (decoded) {
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                sessionId: decoded.sessionId,
            };
        }

        next();
    } catch (error) {
        logger.error("Optional authentication middleware error", {
            error: error instanceof Error ? error.message : String(error),
        });
        next(); // Continue even if error
    }
};
