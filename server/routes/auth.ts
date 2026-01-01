import { RequestHandler } from "express";
import {
  initiateSignup,
  verifyEmailToken,
  canResendVerification,
  getUser,
  createOrUpdateGoogleUser,
} from "../services/otp";
import { sendEmail, generateVerificationEmailHTML } from "../services/email";
import { generateToken } from "../services/jwt";
import logger from "../services/logger";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

export const handleRequestVerification: RequestHandler = async (req, res) => {
  // Validation is handled by middleware
  const { email } = req.body;

  const result = await initiateSignup(email);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const token = result.token!;
  const verificationLink = `${FRONTEND_URL}/verify-email?token=${token}`;

  const emailSent = await sendEmail({
    to: email,
    subject: "Verify Your Email - Eraya Wellness Travels",
    html: generateVerificationEmailHTML(verificationLink),
    text: `Click this link to verify your email: ${verificationLink}. This link will expire in 24 hours.`,
  });

  if (!emailSent) {
    logger.error(`Failed to send verification email to ${email}`);
    return res.status(500).json({
      error: "Failed to send verification email. Please try again.",
    });
  }

  logger.info("Verification email sent", { email, verificationLink });

  res.status(200).json({
    success: true,
    message: "Verification email sent. Please check your inbox.",
  });
};

export const handleVerifyEmailToken: RequestHandler = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ error: "Verification token is required" });
  }

  const verifyResult = await verifyEmailToken(token);

  if (!verifyResult.success) {
    return res.status(400).json({ error: verifyResult.error });
  }

  const user = verifyResult.user!;

  // Generate JWT token for automatic login
  try {
    const { token: jwtToken, sessionId } = await generateToken(user.id, user.email);

    logger.info("Email verified and user logged in", {
      userId: user.id,
      email: user.email,
      sessionId,
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
        isVerified: user.isVerified,
      },
      token: jwtToken,
    });
  } catch (error) {
    logger.error("Failed to generate token after email verification", {
      email: user.email,
      error: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({
      error: "Verification successful but failed to create session. Please try logging in.",
    });
  }
};

export const handleResendVerification: RequestHandler = async (req, res) => {
  // Validation is handled by middleware
  const { email } = req.body;

  const user = await getUser(email);

  if (!user) {
    return res
      .status(400)
      .json({ error: "No account found for this email." });
  }

  if (user.isVerified) {
    return res.status(400).json({ error: "Email already verified" });
  }

  const cooldownCheck = await canResendVerification(email);

  if (!cooldownCheck.canResend) {
    const seconds = Math.ceil((cooldownCheck.cooldownMs || 0) / 1000);
    return res.status(429).json({
      error: `Please wait ${seconds} seconds before requesting a new verification email`,
      cooldownMs: cooldownCheck.cooldownMs,
    });
  }

  const result = await initiateSignup(email);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const token = result.token!;
  const verificationLink = `${FRONTEND_URL}/verify-email?token=${token}`;

  const emailSent = await sendEmail({
    to: email,
    subject: "Verify Your Email - Eraya Wellness Travels",
    html: generateVerificationEmailHTML(verificationLink),
    text: `Click this link to verify your email: ${verificationLink}. This link will expire in 24 hours.`,
  });

  if (!emailSent) {
    logger.error(`Failed to send verification email to ${email}`);
    return res.status(500).json({
      error: "Failed to send verification email. Please try again.",
    });
  }

  logger.info("Verification email resent", { email });

  res.status(200).json({
    success: true,
    message: "New verification email sent. Please check your inbox.",
  });
};

// Google OAuth is now handled entirely by Supabase on the client side
// The backend no longer needs to verify Firebase tokens
// Users authenticate directly with Supabase and maintain their session there
export const handleGoogleAuth: RequestHandler = async (req, res) => {
  res.status(501).json({
    error: "Google authentication is handled by Supabase. This endpoint is deprecated."
  });
};

export const handleForgotPassword: RequestHandler = (req, res) => {
  res.status(501).json({ error: "Not implemented - using OTP-based authentication" });
};

export const handleLogin: RequestHandler = (req, res) => {
  res.status(501).json({ error: "Not implemented - using OTP-based authentication" });
};

export const handleSignup: RequestHandler = (req, res) => {
  res.status(501).json({ error: "Not implemented - using OTP-based authentication" });
};

