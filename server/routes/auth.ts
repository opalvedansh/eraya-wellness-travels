import { RequestHandler } from "express";
import {
  initiateSignup,
  verifyOTP as verifyOTPService,
  canResendOTP,
  getUser,
  createOrUpdateGoogleUser,
} from "../services/otp";
import { sendEmail, generateOTPEmailHTML } from "../services/email";
import { printOTPToConsole } from "../services/dev-email-tester";
import { generateToken } from "../services/jwt";
import logger from "../services/logger";
import { verifyFirebaseToken } from "../config/firebase-admin.config";

export const handleRequestOTP: RequestHandler = async (req, res) => {
  // Validation is handled by middleware
  const { email } = req.body;

  const result = await initiateSignup(email);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const otp = result.otp!;

  const emailSent = await sendEmail({
    to: email,
    subject: "Email Verification - Eraya Wellness Travels",
    html: generateOTPEmailHTML(otp),
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
  });

  if (!emailSent) {
    logger.error(`Failed to send OTP email to ${email}`);
    return res.status(500).json({
      error: "Failed to send verification email. Please check your email configuration.",
    });
  }

  printOTPToConsole(email, otp);

  res.status(200).json({
    success: true,
    message: "OTP sent to your email address",
  });
};

export const handleVerifyOTP: RequestHandler = async (req, res) => {
  // Validation is handled by middleware
  const { email, otp } = req.body;

  const verifyResult = await verifyOTPService(email, otp);

  if (!verifyResult.success) {
    return res.status(400).json({ error: verifyResult.error });
  }

  const user = await getUser(email);

  if (!user) {
    logger.error("User not found after successful OTP verification", { email });
    return res
      .status(400)
      .json({ error: "User not found. Please start over." });
  }

  // Generate JWT token
  try {
    const { token, sessionId } = await generateToken(user.id, user.email);

    logger.info("User verified and token generated", {
      userId: user.id,
      email: user.email,
      sessionId,
    });

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      user: {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    logger.error("Failed to generate token after OTP verification", {
      email,
      error: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({
      error: "Verification successful but failed to create session. Please try logging in.",
    });
  }
};

export const handleResendOTP: RequestHandler = async (req, res) => {
  // Validation is handled by middleware
  const { email } = req.body;

  const user = await getUser(email);

  if (!user) {
    return res
      .status(400)
      .json({ error: "No signup in progress for this email." });
  }

  const cooldownCheck = await canResendOTP(email);

  if (!cooldownCheck.canResend) {
    const seconds = Math.ceil((cooldownCheck.cooldownMs || 0) / 1000);
    return res.status(429).json({
      error: `Please wait ${seconds} seconds before requesting a new OTP`,
      cooldownMs: cooldownCheck.cooldownMs,
    });
  }

  const result = await initiateSignup(email);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const otp = result.otp!;

  const emailSent = await sendEmail({
    to: email,
    subject: "New Email Verification Code - Eraya Wellness Travels",
    html: generateOTPEmailHTML(otp),
    text: `Your new OTP is: ${otp}. It will expire in 5 minutes.`,
  });

  if (!emailSent) {
    logger.error(`Failed to send OTP email to ${email}`);
    return res.status(500).json({
      error: "Failed to send verification email. Please check your email configuration.",
    });
  }

  printOTPToConsole(email, otp);

  res.status(200).json({
    success: true,
    message: "New OTP sent to your email address",
  });
};

export const handleGoogleAuth: RequestHandler = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "ID token is required" });
  }

  try {
    // Verify Firebase ID token
    const verificationResult = await verifyFirebaseToken(idToken);

    if (!verificationResult.success || !verificationResult.decodedToken) {
      logger.error("Firebase token verification failed", {
        error: verificationResult.error,
      });
      return res.status(401).json({
        error: verificationResult.error || "Invalid authentication token",
      });
    }

    const decodedToken = verificationResult.decodedToken;

    // Extract user data from token
    const googleData = {
      googleUid: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name || null,
      photoURL: decodedToken.picture || null,
    };

    if (!googleData.email) {
      logger.error("No email in Google token", { uid: googleData.googleUid });
      return res.status(400).json({
        error: "Email is required for authentication",
      });
    }

    // Create or update user in database
    const userResult = await createOrUpdateGoogleUser(googleData);

    if (!userResult.success || !userResult.user) {
      return res.status(500).json({
        error: userResult.error || "Failed to authenticate user",
      });
    }

    // Generate app JWT token
    const { token, sessionId } = await generateToken(
      userResult.user.id,
      userResult.user.email
    );

    logger.info("Google authentication successful", {
      userId: userResult.user.id,
      email: userResult.user.email,
      sessionId,
    });

    res.status(200).json({
      success: true,
      message: "Google authentication successful",
      user: {
        id: userResult.user.id,
        email: userResult.user.email,
        name: userResult.user.name,
        photoURL: userResult.user.photoURL,
        isVerified: userResult.user.isVerified,
      },
      token,
    });
  } catch (error) {
    logger.error("Google authentication error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({
      error: "Authentication failed. Please try again.",
    });
  }
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

