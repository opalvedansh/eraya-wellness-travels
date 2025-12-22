import "dotenv/config";
import express from "express";
import { handleDemo } from "./routes/demo";
import {
  handleContact,
  handleReviewSubmission,
  handleTransformationSubmission,
  getReviews,
  getTransformations
} from "./routes/contact";
import { handleCustomizeTrip } from "./routes/customize";
import {
  handleForgotPassword,
  handleLogin,
  handleSignup,
  handleRequestOTP,
  handleVerifyOTP,
  handleResendOTP,
  handleGoogleAuth,
} from "./routes/auth";
import { corsConfig } from "./config/cors.config";
import { requestLogger, errorLogger } from "./middleware/logging.middleware";
import {
  generalRateLimit,
  otpRateLimit,
  contactRateLimit,
} from "./middleware/rate-limit.middleware";
import { validateRequest } from "./middleware/validation.middleware";
import {
  requestOTPSchema,
  verifyOTPSchema,
  resendOTPSchema,
  contactSchema,
  customizeTripSchema,
} from "./validation/schemas";
import logger from "./services/logger";
import { authenticate } from "./middleware/auth.middleware";
import { cleanupExpiredSessions } from "./services/jwt";
import { cleanupExpiredOTPs } from "./services/otp";

export function createServer() {
  const app = express();

  // Trust proxy for correct IP in rate limiting (important for production behind proxy/load balancer)
  app.set("trust proxy", 1);

  // CORS Configuration
  app.use(corsConfig);

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use(requestLogger);

  // General rate limiting
  app.use("/api", generalRateLimit);

  // Health check endpoint (no auth required)
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo endpoint
  app.get("/api/demo", handleDemo);

  // Contact form endpoint (with rate limiting and validation)
  app.post(
    "/api/contact",
    contactRateLimit,
    validateRequest(contactSchema),
    handleContact
  );

  // Review submission endpoint
  app.post(
    "/api/contact/review",
    contactRateLimit,
    handleReviewSubmission
  );

  // Transformation story submission endpoint
  app.post(
    "/api/contact/transformation",
    contactRateLimit,
    handleTransformationSubmission
  );

  // Get approved reviews (for homepage)
  app.get("/api/reviews", getReviews);

  // Get approved transformations (for about page)
  app.get("/api/transformations", getTransformations);

  // Customize trip endpoint (with rate limiting and validation)
  app.post(
    "/api/customize-trip",
    contactRateLimit,
    validateRequest(customizeTripSchema),
    handleCustomizeTrip
  );

  // Auth endpoints (with rate limiting and validation)
  app.post(
    "/api/request-otp",
    otpRateLimit,
    validateRequest(requestOTPSchema),
    handleRequestOTP
  );

  app.post(
    "/api/verify-otp",
    otpRateLimit,
    validateRequest(verifyOTPSchema),
    handleVerifyOTP
  );

  app.post(
    "/api/resend-otp",
    otpRateLimit,
    validateRequest(resendOTPSchema),
    handleResendOTP
  );

  // Google OAuth endpoint
  app.post("/api/auth/google", otpRateLimit, handleGoogleAuth);

  // Legacy endpoints (not implemented)
  app.post("/api/forgot-password", handleForgotPassword);
  app.post("/api/login", handleLogin);
  app.post("/api/signup", handleSignup);

  // Example protected endpoint (requires authentication)
  app.get("/api/me", authenticate, (req, res) => {
    res.json({
      user: req.user,
    });
  });

  // Catch-all middleware: pass non-API routes to Vite for SPA routing
  // This ensures React Router can handle client-side routes in development
  // Must be after all API routes
  app.use((req, res, next) => {
    // If this is an API route that wasn't handled, return 404
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }

    // For all other routes, pass to Vite dev server
    // Vite will serve index.html for SPA routing
    next();
  });

  // Error logging middleware
  app.use(errorLogger);

  // Setup cleanup intervals
  setupCleanupIntervals();

  logger.info("Server initialized successfully");

  return app;
}

/**
 * Setup periodic cleanup tasks
 */
function setupCleanupIntervals() {
  // Clean up expired sessions every hour
  setInterval(
    async () => {
      try {
        await cleanupExpiredSessions();
      } catch (error) {
        logger.error("Error in session cleanup interval", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
    60 * 60 * 1000
  ); // 1 hour

  // Clean up expired OTPs every 10 minutes
  setInterval(
    async () => {
      try {
        await cleanupExpiredOTPs();
      } catch (error) {
        logger.error("Error in OTP cleanup interval", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
    10 * 60 * 1000
  ); // 10 minutes

  logger.info("Cleanup intervals configured");
}
