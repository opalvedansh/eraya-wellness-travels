import { RequestHandler } from "express";
import { prisma } from "../services/prisma";
import { sendEmail } from "../services/email";
import logger from "../services/logger";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "erayawellnesstravels@gmail.com";

// ES module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleContact: RequestHandler = async (req, res) => {
  try {
    // Validation is handled by middleware
    const { name, email, phone, subject, message } = req.body;

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
      },
    });

    logger.info("Contact form submission received", {
      id: submission.id,
      email: submission.email,
      subject: submission.subject,
    });

    // Send email notification to admin
    const adminEmailSent = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      html: generateAdminNotificationHTML(submission),
      text: `New contact form submission from ${name} (${email}):\n\n${message}`,
    });

    if (!adminEmailSent) {
      logger.warn("Failed to send admin notification email", {
        submissionId: submission.id,
      });
    }

    // Send confirmation email to user
    const userEmailSent = await sendEmail({
      to: email,
      subject: "We received your message - Eraya Wellness Travels",
      html: generateUserConfirmationHTML(name),
      text: `Dear ${name},\n\nThank you for contacting Eraya Wellness Travels. We have received your message and will get back to you within 24 hours.\n\nBest regards,\nEraya Wellness Travels Team`,
    });

    if (!userEmailSent) {
      logger.warn("Failed to send user confirmation email", {
        submissionId: submission.id,
        userEmail: email,
      });
    }

    res.status(200).json({
      success: true,
      message: "Your message has been received. We'll get back to you within 24 hours.",
    });
  } catch (error) {
    logger.error("Error handling contact form", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request. Please try again later.",
    });
  }
};

function generateAdminNotificationHTML(submission: {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: Date;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2d5016 0%, #3a6b1f 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">Eraya Wellness Travels</p>
      </div>
      
      <div style="background: #f5f1e8; padding: 30px 20px;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
          <h3 style="margin: 0 0 15px 0; color: #2d5016;">Contact Information</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${submission.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${submission.email}">${submission.email}</a></p>
          ${submission.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${submission.phone}</p>` : ""}
          <p style="margin: 5px 0;"><strong>Received:</strong> ${submission.createdAt.toLocaleString()}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: #2d5016;">Subject</h3>
          <p style="margin: 0 0 15px 0;">${submission.subject}</p>
          
          <h3 style="margin: 15px 0 10px 0; color: #2d5016;">Message</h3>
          <p style="margin: 0; white-space: pre-wrap;">${submission.message}</p>
        </div>
      </div>
      
      <div style="background: #2d5016; color: white; padding: 15px 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
        <p style="margin: 0;">Please respond within 24 hours</p>
      </div>
    </div>
  `;
}

function generateUserConfirmationHTML(name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2d5016 0%, #3a6b1f 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Eraya Wellness Travels</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Thank You for Reaching Out</p>
      </div>
      
      <div style="background: #f5f1e8; padding: 40px 20px; text-align: center;">
        <h2 style="color: #2d5016; margin-top: 0;">Message Received!</h2>
        <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
          Dear ${name},
        </p>
        <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
          Thank you for contacting Eraya Wellness Travels. We have received your message and will get back to you within 24 hours.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5016; margin: 20px 0; text-align: left;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            In the meantime, feel free to explore our wellness travel packages and discover the transformative journeys we offer.
          </p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          <strong style="color: #2d5016;">Eraya Wellness Travels Team</strong>
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

// Helper function to read/write JSON file
const dataFilePath = path.join(__dirname, "../data/submissions.json");

async function readSubmissionsData() {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return default structure
    return { reviews: [], transformations: [], callbacks: [] };
  }
}

async function writeSubmissionsData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

// Review submission handler
export const handleReviewSubmission: RequestHandler = async (req, res) => {
  try {
    const { name, email, rating, review, location, displayOnHomepage } = req.body;

    // Validate required fields
    if (!name || !email || !rating || !review || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const reviewData = {
      id: Date.now().toString(),
      name,
      email,
      rating: Number(rating),
      review,
      location,
      displayOnHomepage: displayOnHomepage || false,
      createdAt: new Date().toISOString(),
      approved: true, // Auto-approve for now
    };

    // Read existing data
    const data = await readSubmissionsData();
    data.reviews.push(reviewData);
    await writeSubmissionsData(data);

    logger.info("Review submission received", {
      id: reviewData.id,
      name: reviewData.name,
    });

    res.status(200).json({
      success: true,
      message: "Thank you for your review! It will appear on our website shortly.",
    });
  } catch (error) {
    logger.error("Error handling review submission", {
      error: error instanceof Error ? error.message : String(error),
    });

    res.status(500).json({
      success: false,
      message: "An error occurred while processing your review. Please try again later.",
    });
  }
};

// Transformation story submission handler
export const handleTransformationSubmission: RequestHandler = async (req, res) => {
  try {
    const { name, age, storyTitle, story, location, sharePublicly } = req.body;

    // Validate required fields
    if (!name || !age || !storyTitle || !story || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const transformationData = {
      id: Date.now().toString(),
      name,
      age,
      storyTitle,
      story,
      location,
      sharePublicly: sharePublicly || false,
      createdAt: new Date().toISOString(),
      approved: true, // Auto-approve for now
    };

    // Read existing data
    const data = await readSubmissionsData();
    data.transformations.push(transformationData);
    await writeSubmissionsData(data);

    logger.info("Transformation story submission received", {
      id: transformationData.id,
      name: transformationData.name,
    });

    res.status(200).json({
      success: true,
      message: "Thank you for sharing your transformation story! It will appear on our website shortly.",
    });
  } catch (error) {
    logger.error("Error handling transformation submission", {
      error: error instanceof Error ? error.message : String(error),
    });

    res.status(500).json({
      success: false,
      message: "An error occurred while processing your story. Please try again later.",
    });
  }
};

// Get reviews (for displaying on homepage)
export const getReviews: RequestHandler = async (req, res) => {
  try {
    const data = await readSubmissionsData();
    const approvedReviews = data.reviews.filter((r: any) => r.approved && r.displayOnHomepage);

    res.status(200).json({
      success: true,
      reviews: approvedReviews,
    });
  } catch (error) {
    logger.error("Error fetching reviews", {
      error: error instanceof Error ? error.message : String(error),
    });

    res.status(500).json({
      success: false,
      reviews: [],
    });
  }
};

// Get transformation stories (for displaying on about page)
export const getTransformations: RequestHandler = async (req, res) => {
  try {
    const data = await readSubmissionsData();
    const approvedTransformations = data.transformations.filter((t: any) => t.approved && t.sharePublicly);

    res.status(200).json({
      success: true,
      transformations: approvedTransformations,
    });
  } catch (error) {
    logger.error("Error fetching transformations", {
      error: error instanceof Error ? error.message : String(error),
    });

    res.status(500).json({
      success: false,
      transformations: [],
    });
  }
};

