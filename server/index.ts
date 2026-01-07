// Only load .env file in development - Railway sets env vars directly in production
// Loading dotenv in production would override Railway's environment variables with local .env values
if (process.env.NODE_ENV !== "production") {
  // Dynamic import isn't needed here since NODE_ENV is set before the process starts
  require("dotenv/config");
}
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
import debugRoutes from "./routes/debug.routes";
import paymentRoutes from "./routes/payment.routes";
import adminRoutes from "./routes/admin.routes";
import debugAdminRoutes from "./routes/debug.admin.routes";
import contentRoutes from "./routes/content.routes";
import publicRoutes from "./routes/public.routes";
import uploadRoutes from "./routes/upload.routes";
import spiritualPostsRoutes from "./routes/spiritual-posts.routes";
import blogPostsRoutes from "./routes/blog-posts.routes";
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
import { initializePrisma, isPrismaReady } from "./services/prisma";

/**
 * Validate required environment variables on startup
 */
function validateEnvironment() {
  // ENHANCED DEBUG: Log environment variable status at startup
  console.log('=== ENVIRONMENT DEBUG START ===');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
  console.log(`DATABASE_URL length: ${process.env.DATABASE_URL?.length || 0}`);
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      console.log(`DATABASE_URL host: ${url.hostname}`);
      console.log(`DATABASE_URL port: ${url.port}`);
    } catch (e) {
      console.log(`DATABASE_URL parse error: ${e}`);
    }
  }
  console.log('=== ENVIRONMENT DEBUG END ===');

  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'RESEND_API_KEY',
    'GEMINI_API_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    logger.error('Missing required environment variables', { missing });
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('Please set these in your .env file or Railway dashboard');
    process.exit(1);
  }

  // Warn about optional but recommended variables
  const recommended = ['ALLOWED_ORIGINS', 'FRONTEND_URL', 'ADMIN_EMAIL'];
  const missingRecommended = recommended.filter(key => !process.env[key]);

  if (missingRecommended.length > 0) {
    logger.warn('Missing recommended environment variables', { missingRecommended });
  }

  logger.info('Environment validation passed');
}

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
  app.get("/health", async (_req, res) => {
    try {
      // Check database connectivity - prisma is guaranteed to be initialized at startup
      const { prisma } = await import("./services/prisma");
      await prisma.$queryRaw`SELECT 1`;

      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      logger.error('Health check failed', { error });
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Legacy ping endpoint (kept for backwards compatibility)
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

  // Debug admin endpoints (for diagnostics)
  app.use("/api/admin", debugAdminRoutes);

  // Settings routes (admin for write, public for read)
  app.use("/api/settings", settingsRoutes);

  // Public Content routes
  app.use("/api/content", contentRoutes);

  // Spiritual Posts routes (public and admin)
  app.use("/api/spiritual-posts", spiritualPostsRoutes);

  // Blog Posts routes (public and admin)
  app.use("/api/blog-posts", blogPostsRoutes);

  // DEBUG ROUTE (Temporary)
  // Used to diagnose database connection issues in production
  app.use("/api", debugRoutes);

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


// Global error handlers for production safety
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  // Don't exit in production to avoid downtime from unhandled promises
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  // Always exit on uncaught exceptions as the process state is unreliable
  process.exit(1);
});

// Start server only when this file is run directly
// ESM-compatible entry point detection (import.meta.url check)
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  // Wrap in async IIFE to allow top-level await
  (async () => {
    try {
      // Validate environment variables before starting
      validateEnvironment();

      // Initialize database connection before starting server
      console.log('⏳ Connecting to database...');
      await initializePrisma();
      console.log('✅ Database connected successfully');

      const PORT = parseInt(process.env.PORT || '8080', 10);
      const HOST = '0.0.0.0'; // Bind to all interfaces for Railway/Docker
      const app = createServer();

      app.listen(PORT, HOST, () => {
        logger.info('Server started successfully', {
          port: PORT,
          host: HOST,
          environment: process.env.NODE_ENV || 'development',
          nodeVersion: process.version
        });
        console.log(`🚀 Server running on ${HOST}:${PORT}`);
        console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  })();
}
