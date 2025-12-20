import rateLimit from "express-rate-limit";

/**
 * Strict rate limiting for authentication endpoints
 * 5 requests per 15 minutes per IP
 */
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: {
        error: "Too many authentication attempts",
        message: "Please try again later",
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
    // Skip successful requests from counting
    skipSuccessfulRequests: false,
});

/**
 * Moderate rate limiting for OTP-related endpoints
 * 10 requests per 15 minutes per IP
 */
export const otpRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: {
        error: "Too many OTP requests",
        message: "Please try again in 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiting for contact form submissions
 * 3 requests per hour per IP
 */
export const contactRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: {
        error: "Too many contact form submissions",
        message: "Please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * General API rate limiting
 * 100 requests per 15 minutes per IP
 */
export const generalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        error: "Too many requests",
        message: "Please slow down and try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
