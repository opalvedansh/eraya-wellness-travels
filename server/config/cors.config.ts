import cors from "cors";
import logger from "../services/logger";

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",").map((origin) =>
    origin.trim()
) || ["http://localhost:5173", "http://localhost:8080"];

logger.info("CORS configured with allowed origins", { origins: ALLOWED_ORIGINS });

export const corsConfig = cors({
    origin: (origin, callback) => {
        // ALWAYS allow requests with no origin
        // This includes same-origin requests, Vite HMR, mobile apps, curl, Postman
        if (!origin) {
            return callback(null, true);
        }

        // Check if origin is in allowed list or wildcard
        if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes("*")) {
            return callback(null, true);
        }

        // Log blocked origin but don't throw error - just deny
        logger.warn("CORS blocked request from unauthorized origin", { origin });
        return callback(null, false); // Changed from throwing error to returning false
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],
});
