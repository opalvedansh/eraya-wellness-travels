import cors from "cors";
import logger from "../services/logger";

const isProduction = process.env.NODE_ENV === 'production';

// In production, ALLOWED_ORIGINS should be set, but we also default to known production domains
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",").map((origin) =>
    origin.trim()
) || (isProduction
    ? ["https://www.erayawellness.com", "https://erayawellness.com", "https://eraya-wellness-travels-production.up.railway.app"]
    : ["http://localhost:5173", "http://localhost:8080", "http://localhost:8081"]);

// Add known domains to ALLOWED_ORIGINS if they aren't already there (merging env var with defaults)
if (isProduction) {
    const defaultDomains = ["https://www.erayawellness.com", "https://erayawellness.com"];
    defaultDomains.forEach(domain => {
        if (!ALLOWED_ORIGINS.includes(domain)) {
            ALLOWED_ORIGINS.push(domain);
        }
    });
}

if (isProduction && ALLOWED_ORIGINS.length === 0) {
    logger.error('ALLOWED_ORIGINS environment variable is required in production');
    console.error('❌ ALLOWED_ORIGINS must be set in production (e.g., your Vercel frontend domain)');
}

logger.info("CORS configured with allowed origins", { origins: ALLOWED_ORIGINS, environment: process.env.NODE_ENV });

export const corsConfig = cors({
    origin: (origin, callback) => {
        // ALWAYS allow requests with no origin
        // This includes same-origin requests, Vite HMR, mobile apps, curl, Postman
        if (!origin) {
            return callback(null, true);
        }

        // Check if origin is in allowed list
        // NOTE: Wildcard "*" is intentionally NOT supported for security
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }

        // Log blocked origin in development for debugging
        if (!isProduction) {
            logger.warn("CORS blocked request from unauthorized origin", { origin });
        }

        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],
});
