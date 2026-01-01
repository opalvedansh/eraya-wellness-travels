import { Resend } from "resend";
import logger from "./logger";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

let resendClient: Resend | null = null;

function initializeResend(): Resend | null {
  if (resendClient) return resendClient;

  if (!RESEND_API_KEY) {
    logger.info(
      "RESEND_API_KEY not configured. Email sending will be in console mode."
    );
    return null;
  }

  try {
    resendClient = new Resend(RESEND_API_KEY);
    logger.info("✓ Email service configured with Resend");
    return resendClient;
  } catch (error) {
    logger.error("Failed to initialize Resend", {
      error: error instanceof Error ? error.message : String(error),
    });
    resendClient = null;
    return null;
  }
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, html, text } = options;

  if (!RESEND_API_KEY) {
    logger.info("EMAIL NOTIFICATION (Console Mode)", {
      to,
      subject,
      text: text || "(No plain text)",
    });
    return true; // Return true in console mode for development
  }

  try {
    const resend = initializeResend();

    if (!resend) {
      logger.warn(`Resend not available. Would send email to: ${to}`, {
        subject,
      });
      return false;
    }

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html,
      text,
    });

    if (error) {
      logger.error(`Resend API error when sending to ${to}`, {
        subject,
        error: error.message || String(error),
      });
      return false;
    }

    logger.info(`✓ Email sent successfully to ${to}`, {
      subject,
      emailId: data?.id
    });
    return true;
  } catch (error) {
    logger.error(`Failed to send email to ${to}`, {
      subject,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

export function generateVerificationEmailHTML(verificationLink: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2d5016 0%, #3a6b1f 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Eraya Wellness Travels</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Email Verification</p>
      </div>
      
      <div style="background: #f5f1e8; padding: 40px 20px; text-align: center;">
        <h2 style="color: #2d5016; margin-top: 0;">Verify Your Email Address</h2>
        <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
          Thank you for signing up! Click the button below to verify your email address and activate your account.
        </p>
        
        <a href="${verificationLink}" style="display: inline-block; background: #2d5016; color: white; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 20px 0;">
          Verify Email Address
        </a>
        
        <p style="color: #999; font-size: 14px; margin: 30px 0 10px 0;">
          This link will expire in 24 hours.
        </p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="color: #2d5016; font-size: 12px; word-break: break-all; margin: 10px 0;">
          ${verificationLink}
        </p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          If you didn't request this email, please ignore it. Your account remains secure.
        </p>
      </div>
      
      <div style="background: #2d5016; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
        <p style="margin: 0;">
          © ${new Date().getFullYear()} Eraya Wellness Travels. All rights reserved.
        </p>
      </div>
    </div>
  `;
}
