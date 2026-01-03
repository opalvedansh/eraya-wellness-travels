import "dotenv/config";
import express from "express";
import path from "path";
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
  handleRequestVerification,
  handleVerifyEmailToken,
  handleResendVerification,
  handleGoogleAuth,
} from "./routes/auth";
import { handleChat } from "./routes/chat";
import bookingRoutes from "./routes/bookings";
import profileRoutes from "./routes/profile";
import paymentRoutes from "./routes/payment.routes";
import adminRoutes from "./routes/admin.routes";
import contentRoutes from "./routes/content.routes";
import publicRoutes from "./routes/public.routes";
import uploadRoutes from "./routes/upload.routes";
import { corsConfig } from "./config/cors.config";
import settingsRoutes from "./routes/settings.routes";
import { requestLogger, errorLogger } from "./middleware/logging.middleware";
import {
  generalRateLimit,
  otpRateLimit,
  contactRateLimit,
} from "./middleware/rate-limit.middleware";
import { validateRequest } from "./middleware/validation.middleware";
import {
  requestOTPSchema,
  resendOTPSchema,
  contactSchema,
  customizeTripSchema,
  chatMessageSchema,
} from "./validation/schemas";
import logger from "./services/logger";
import { authenticate } from "./middleware/auth.middleware";
import { cleanupExpiredSessions } from "./services/jwt";
import { cleanupExpiredTokens } from "./services/otp";

export function createServer() {
  const app = express();

  // Trust proxy for correct IP in rate limiting (important for production behind proxy/load balancer)
  app.set("trust proxy", 1);


  // CORS Configuration
  app.use(corsConfig);

  // Conditional body parsing: raw body for webhook, JSON for everything else
  app.use((req, res, next) => {
    if (req.path === "/api/stripe-webhook") {
      express.raw({ type: "application/json" })(req, res, next);
    } else {
      next();
    }
  });

  // Body parsing middleware for all other routes
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

  // Chat endpoint (with rate limiting and validation)
  app.post(
    "/api/chat",
    contactRateLimit,
    validateRequest(chatMessageSchema),
    handleChat
  );

  // Auth endpoints (with rate limiting and validation)
  app.post(
    "/api/request-verification",
    otpRateLimit,
    validateRequest(requestOTPSchema),
    handleRequestVerification
  );

  app.get(
    "/api/verify-email/:token",
    otpRateLimit,
    handleVerifyEmailToken
  );

  app.post(
    "/api/resend-verification",
    otpRateLimit,
    validateRequest(resendOTPSchema),
    handleResendVerification
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

  // Booking endpoints (protected)
  app.use("/api/bookings", bookingRoutes);

  // Profile endpoints (protected)
  app.use("/api/profile", profileRoutes);

  // Payment endpoints (checkout session requires auth, webhook does not)
  app.use("/api", paymentRoutes);

  // Public routes for tours and treks (no auth required)
  app.use("/api", publicRoutes);

  // Serve static files from uploads directory
  app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

  // Upload routes (protected, admin only)
  app.use("/api/admin", uploadRoutes);

  // Admin endpoints (protected, admin only)
  app.use("/api/admin", adminRoutes);

  // Settings routes (admin for write, public for read)
  app.use("/api/settings", settingsRoutes);

  // Public Content routes
  app.use("/api/content", contentRoutes);

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

  // Clean up expired verification tokens every 10 minutes
  setInterval(
    async () => {
      try {
        await cleanupExpiredTokens();
      } catch (error) {
        logger.error("Error in verification token cleanup interval", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
    10 * 60 * 1000
  ); // 10 minutes

  logger.info("Cleanup intervals configured");
}


// Start server only when this file is run directly
// For Vercel, this block won't execute (uses api/index.ts wrapper instead)
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  const app = createServer();

  app.listen(PORT, () => {
    logger.info("Server started successfully", {
      port: PORT,
      environment: process.env.NODE_ENV || "development",
    });
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
