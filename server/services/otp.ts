import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { prisma } from "./prisma";
import logger from "./logger";

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
const MAX_OTP_ATTEMPTS = 5;

/**
 * Generate a cryptographically secure OTP
 */
function generateOTP(length: number = 6): string {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10).toString();
  }
  return otp;
}

/**
 * Hash OTP for secure storage
 */
async function hashOTP(otp: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(otp, salt);
}

/**
 * Verify OTP against hash
 */
async function verifyOTPHash(otp: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(otp, hash);
}

/**
 * Initiate signup by creating user and sending OTP
 */
export async function initiateSignup(
  email: string
): Promise<{ success: boolean; otp?: string; error?: string }> {
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

    // Check for recent OTP (cooldown)
    const recentOTP = await prisma.oTP.findFirst({
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

    if (recentOTP) {
      const timeSinceLastOTP = Date.now() - new Date(recentOTP.createdAt).getTime();
      if (timeSinceLastOTP < 60000) {
        // 1 minute cooldown
        logger.warn("OTP requested too soon", { email: emailLower });
        return {
          success: false,
          error: "Signup already in progress. Please check your email.",
        };
      }
    }

    // Generate and hash OTP
    const otp = generateOTP(6);
    const otpHash = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

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

    // Create OTP record
    await prisma.oTP.create({
      data: {
        email: emailLower,
        otpHash,
        expiresAt,
        attempts: 0,
      },
    });

    logger.info("OTP generated", { email: emailLower });
    return { success: true, otp };
  } catch (error) {
    logger.error("Error initiating signup", {
      email: emailLower,
      error: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error: "Failed to initiate signup" };
  }
}

/**
 * Verify OTP for a user
 */
export async function verifyOTP(
  email: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  const emailLower = email.toLowerCase();

  try {
    // Get the latest OTP for this email
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        email: emailLower,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      logger.warn("OTP verification failed - no OTP found", { email: emailLower });
      return { success: false, error: "No OTP found for this email" };
    }

    // Check if too many attempts
    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      logger.warn("OTP verification failed - too many attempts", { email: emailLower });
      await prisma.oTP.delete({ where: { id: otpRecord.id } });
      return {
        success: false,
        error: "Too many failed attempts. Please request a new OTP.",
      };
    }

    // Check if expired
    if (new Date() > otpRecord.expiresAt) {
      logger.warn("OTP verification failed - expired", { email: emailLower });
      await prisma.oTP.delete({ where: { id: otpRecord.id } });
      return {
        success: false,
        error: "OTP has expired. Please request a new one.",
      };
    }

    // Verify OTP
    const isValid = await verifyOTPHash(otp, otpRecord.otpHash);

    if (!isValid) {
      // Increment attempts
      await prisma.oTP.update({
        where: { id: otpRecord.id },
        data: {
          attempts: otpRecord.attempts + 1,
          lastAttemptAt: new Date(),
        },
      });

      logger.warn("OTP verification failed - invalid OTP", {
        email: emailLower,
        attempts: otpRecord.attempts + 1,
      });

      return { success: false, error: "Invalid OTP. Please try again." };
    }

    // OTP is valid - verify user and cleanup
    await prisma.$transaction([
      prisma.user.update({
        where: { email: emailLower },
        data: { isVerified: true },
      }),
      prisma.oTP.delete({
        where: { id: otpRecord.id },
      }),
    ]);

    logger.info("OTP verified successfully", { email: emailLower });
    return { success: true };
  } catch (error) {
    logger.error("Error verifying OTP", {
      email: emailLower,
      error: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error: "Failed to verify OTP" };
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
 * Check if user can resend OTP (cooldown check)
 */
export async function canResendOTP(email: string): Promise<{
  canResend: boolean;
  cooldownMs?: number;
}> {
  const emailLower = email.toLowerCase();

  try {
    const latestOTP = await prisma.oTP.findFirst({
      where: { email: emailLower },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    if (!latestOTP) {
      return { canResend: true };
    }

    const timeSinceLastOTP = Date.now() - new Date(latestOTP.createdAt).getTime();

    if (timeSinceLastOTP >= RESEND_COOLDOWN_MS) {
      return { canResend: true };
    }

    return {
      canResend: false,
      cooldownMs: RESEND_COOLDOWN_MS - timeSinceLastOTP,
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
 * Clear all OTPs for an email
 */
export async function clearOTPAttempts(email: string): Promise<void> {
  const emailLower = email.toLowerCase();

  try {
    await prisma.oTP.deleteMany({
      where: { email: emailLower },
    });
    logger.info("OTP attempts cleared", { email: emailLower });
  } catch (error) {
    logger.error("Error clearing OTP attempts", {
      email: emailLower,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Clean up expired OTPs (should run periodically)
 */
export async function cleanupExpiredOTPs(): Promise<number> {
  try {
    const result = await prisma.oTP.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (result.count > 0) {
      logger.info("Expired OTPs cleaned up", { count: result.count });
    }

    return result.count;
  } catch (error) {
    logger.error("Error cleaning up expired OTPs", {
      error: error instanceof Error ? error.message : String(error),
    });
    return 0;
  }
}
