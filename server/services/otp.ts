import crypto from "crypto";
import { prisma } from "./prisma";
import logger from "./logger";

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute

/**
 * Generate a cryptographically secure verification token
 */
function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Initiate signup by creating user and sending verification token
 */
export async function initiateSignup(
  email: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  const emailLower = email.toLowerCase();

  try {
    // Check if user already verified
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
      select: { id: true, isVerified: true },
    });

    if (user && user.isVerified) {
      logger.warn("Signup attempt for verified email", { email: emailLower });
      return {
        success: false,
        error: "Email already registered and verified",
      };
    }

    // Check for recent verification token (cooldown)
    const recentToken = await prisma.verificationToken.findFirst({
      where: {
        email: emailLower,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });

    if (recentToken) {
      const timeSinceLastToken = Date.now() - new Date(recentToken.createdAt).getTime();
      if (timeSinceLastToken < RESEND_COOLDOWN_MS) {
        logger.warn("Verification token requested too soon", { email: emailLower });
        return {
          success: false,
          error: "Verification email already sent. Please check your inbox.",
        };
      }
    }

    // Generate verification token
    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

    // Create user if doesn't exist
    if (!user) {
      await prisma.user.create({
        data: {
          email: emailLower,
          isVerified: false,
        },
      });
      logger.info("New user created", { email: emailLower });
    }

    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { email: emailLower },
    });

    // Create verification token record
    await prisma.verificationToken.create({
      data: {
        email: emailLower,
        token,
        expiresAt,
      },
    });

    logger.info("Verification token generated", { email: emailLower });
    return { success: true, token };
  } catch (error) {
    logger.error("Error initiating signup", {
      email: emailLower,
      error: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error: "Failed to initiate signup" };
  }
}

/**
 * Verify email using verification token
 */
export async function verifyEmailToken(
  token: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    // Find the token in database
    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            photoURL: true,
            isVerified: true,
          },
        },
      },
    });

    if (!tokenRecord) {
      logger.warn("Email verification failed - token not found", { token: token.substring(0, 10) + "..." });
      return { success: false, error: "Invalid verification link" };
    }

    // Check if token is expired
    if (new Date() > tokenRecord.expiresAt) {
      logger.warn("Email verification failed - token expired", { email: tokenRecord.email });
      await prisma.verificationToken.delete({ where: { id: tokenRecord.id } });
      return {
        success: false,
        error: "Verification link has expired. Please request a new one.",
      };
    }

    // Token is valid - verify user and cleanup
    const user = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { email: tokenRecord.email },
        data: { isVerified: true },
        select: {
          id: true,
          email: true,
          name: true,
          photoURL: true,
          isVerified: true,
          createdAt: true,
        },
      });

      await tx.verificationToken.delete({
        where: { id: tokenRecord.id },
      });

      return updatedUser;
    });

    logger.info("Email verified successfully", { email: user.email });
    return { success: true, user };
  } catch (error) {
    logger.error("Error verifying email token", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error: "Failed to verify email" };
  }
}

/**
 * Get user by email
 */
export async function getUser(email: string) {
  const emailLower = email.toLowerCase();
  try {
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
      select: {
        id: true,
        email: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  } catch (error) {
    logger.error("Error getting user", {
      email: emailLower,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Check if user can resend verification email (cooldown check)
 */
export async function canResendVerification(email: string): Promise<{
  canResend: boolean;
  cooldownMs?: number;
}> {
  const emailLower = email.toLowerCase();

  try {
    const latestToken = await prisma.verificationToken.findFirst({
      where: { email: emailLower },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    if (!latestToken) {
      return { canResend: true };
    }

    const timeSinceLastToken = Date.now() - new Date(latestToken.createdAt).getTime();

    if (timeSinceLastToken >= RESEND_COOLDOWN_MS) {
      return { canResend: true };
    }

    return {
      canResend: false,
      cooldownMs: RESEND_COOLDOWN_MS - timeSinceLastToken,
    };
  } catch (error) {
    logger.error("Error checking resend cooldown", {
      email: emailLower,
      error: error instanceof Error ? error.message : String(error),
    });
    // Allow resend on error to not block user
    return { canResend: true };
  }
}

/**
 * Clean up expired verification tokens (should run periodically)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await prisma.verificationToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (result.count > 0) {
      logger.info("Expired verification tokens cleaned up", { count: result.count });
    }

    return result.count;
  } catch (error) {
    logger.error("Error cleaning up expired verification tokens", {
      error: error instanceof Error ? error.message : String(error),
    });
    return 0;
  }
}

/**
 * Create or update user from Google OAuth
 */
export async function createOrUpdateGoogleUser(googleData: {
  googleUid: string;
  email: string;
  name: string | null;
  photoURL: string | null;
}): Promise<{ success: boolean; user?: any; error?: string }> {
  const emailLower = googleData.email.toLowerCase();

  try {
    // First, check if user exists by email or googleUid
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailLower },
          { googleUid: googleData.googleUid },
        ],
      },
    });

    let user;

    if (existingUser) {
      // Update existing user with Google data if not already set
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          googleUid: googleData.googleUid,
          name: googleData.name || existingUser.name,
          photoURL: googleData.photoURL || existingUser.photoURL,
          authProvider: "google",
          isVerified: true, // Google users are automatically verified
        },
        select: {
          id: true,
          email: true,
          name: true,
          photoURL: true,
          isVerified: true,
          createdAt: true,
        },
      });

      logger.info("Google user updated", {
        userId: user.id,
        email: emailLower,
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: emailLower,
          googleUid: googleData.googleUid,
          name: googleData.name,
          photoURL: googleData.photoURL,
          authProvider: "google",
          isVerified: true, // Google users are automatically verified
        },
        select: {
          id: true,
          email: true,
          name: true,
          photoURL: true,
          isVerified: true,
          createdAt: true,
        },
      });

      logger.info("New Google user created", {
        userId: user.id,
        email: emailLower,
      });
    }

    return { success: true, user };
  } catch (error) {
    logger.error("Error creating/updating Google user", {
      email: emailLower,
      error: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error: "Failed to create/update user" };
  }
}

