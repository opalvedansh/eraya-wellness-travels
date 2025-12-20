import nodemailer from "nodemailer";
import logger from "./logger";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || "console";
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || "erayawellnesstravels@gmail.com";

let transporter: any = null;

async function initializeNodemailer(): Promise<any> {
  if (transporter) return transporter;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    logger.info(
      "SMTP not configured (missing SMTP_HOST, SMTP_USER, or SMTP_PASS). Using console mode."
    );
    return null;
  }

  try {
    logger.info(`Initializing SMTP connection to ${SMTP_HOST}:${SMTP_PORT}`);
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.verify();
    logger.info("✓ Email service configured with SMTP");
    return transporter;
  } catch (error) {
    logger.error("Failed to initialize SMTP", {
      error: error instanceof Error ? error.message : String(error),
    });
    logger.error("Check your SMTP credentials. For Gmail, use an App Password instead of your regular password.");
    transporter = null;
    return null;
  }
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, html, text } = options;

  if (EMAIL_PROVIDER === "console" || !SMTP_HOST) {
    logger.info("EMAIL NOTIFICATION (Console Mode)", {
      to,
      subject,
      text: text || "(No plain text)",
    });
    return true;
  }

  try {
    const mail = await initializeNodemailer();

    if (!mail) {
      logger.warn(`SMTP not available. Would send email to: ${to}`, {
        subject,
      });
      return false;
    }

    await mail.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      text,
      html,
    });

    logger.info(`✓ Email sent successfully to ${to}`, { subject });
    return true;
  } catch (error) {
    logger.error(`Failed to send email to ${to}`, {
      subject,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

export function generateOTPEmailHTML(otp: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2d5016 0%, #3a6b1f 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Eraya Wellness Travels</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Email Verification</p>
      </div>
      
      <div style="background: #f5f1e8; padding: 40px 20px; text-align: center;">
        <h2 style="color: #2d5016; margin-top: 0;">Verify Your Email Address</h2>
        <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
          Thank you for signing up! Enter the code below to verify your email address.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #2d5016; margin: 20px 0;">
          <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 2px;">Your Verification Code</p>
          <p style="margin: 15px 0 0 0; font-size: 36px; font-weight: bold; color: #2d5016; letter-spacing: 5px;">
            ${otp}
          </p>
        </div>
        
        <p style="color: #999; font-size: 14px; margin: 20px 0;">
          This code will expire in 5 minutes.
        </p>
        
        <p style="color: #666; font-size: 12px;">
          If you didn't request this code, please ignore this email. Your account remains secure.
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
