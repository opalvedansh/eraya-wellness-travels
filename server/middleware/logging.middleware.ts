import { RequestHandler, ErrorRequestHandler } from "express";
import logger from "../services/logger";

/**
 * Middleware to log all HTTP requests
 */
export const requestLogger: RequestHandler = (req, res, next) => {
    const start = Date.now();

    // Log request
    logger.info("Incoming request", {
        method: req.method,
        path: req.path,
        query: req.query,
        ip: req.ip,
        userAgent: req.get("user-agent"),
    });

    // Log response when finished
    res.on("finish", () => {
        const duration = Date.now() - start;
        const logLevel = res.statusCode >= 400 ? "warn" : "info";

        logger.log(logLevel, "Request completed", {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
        });
    });

    next();
};

/**
 * Error logging middleware
 * Should be used after all other middleware and routes
 */
export const errorLogger: ErrorRequestHandler = (err, req, res, next) => {
    logger.error("Request error", {
        error: err.message,
        stack: err.stack,
        method: req.method,
        path: req.path,
        ip: req.ip,
    });

    next(err);
};
