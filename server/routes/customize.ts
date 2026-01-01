import { RequestHandler } from "express";
import { sendEmail } from "../services/email";
import logger from "../services/logger";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "erayawellnesstravels@gmail.com";

// ES module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to read/write JSON file
const dataFilePath = path.join(__dirname, "../data/submissions.json");

async function readSubmissionsData() {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return default structure
    return { reviews: [], transformations: [], customizeTrips: [] };
  }
}

async function writeSubmissionsData(data: any) {
  // Ensure directory exists
  const dir = path.dirname(dataFilePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

// Customize trip request handler
export const handleCustomizeTrip: RequestHandler = async (req, res) => {
  try {
    // Validation is handled by middleware
    const {
      name,
      email,
      phone,
      startDate,
      endDate,
      groupSize,
      budget,
      interests,
      additionalNotes,
      tripName,
    } = req.body;

    const customizeTripData = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || null,
      startDate,
      endDate,
      groupSize,
      budget,
      interests: interests || [],
      additionalNotes: additionalNotes || "",
      tripName: tripName || null,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    // Read existing data
    const data = await readSubmissionsData();
    if (!data.customizeTrips) {
      data.customizeTrips = [];
    }
    data.customizeTrips.push(customizeTripData);
    await writeSubmissionsData(data);

    logger.info("Customize trip request received", {
      id: customizeTripData.id,
      email: customizeTripData.email,
      tripName: customizeTripData.tripName,
    });

    // Send email notification to admin
    const adminEmailSent = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Trip Customization Request${tripName ? `: ${tripName}` : ""}`,
      html: generateAdminNotificationHTML(customizeTripData),
      text: generateAdminNotificationText(customizeTripData),
    });

    if (!adminEmailSent) {
      logger.warn("Failed to send admin notification email", {
        requestId: customizeTripData.id,
      });
    }

    // Send confirmation email to user
    const userEmailSent = await sendEmail({
      to: email,
      subject: "We received your trip customization request - Eraya Wellness Travels",
      html: generateUserConfirmationHTML(name, tripName),
      text: generateUserConfirmationText(name, tripName),
    });

    if (!userEmailSent) {
      logger.warn("Failed to send user confirmation email", {
        requestId: customizeTripData.id,
        userEmail: email,
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Your customization request has been received. Our trip expert will contact you shortly to finalize your itinerary.",
    });
  } catch (error) {
    logger.error("Error handling customize trip request", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    res.status(500).json({
      success: false,
      message:
        "An error occurred while processing your request. Please try again later.",
    });
  }
};

function generateAdminNotificationHTML(data: {
  name: string;
  email: string;
  phone: string | null;
  startDate: string;
  endDate: string;
  groupSize: string;
  budget: string;
  interests: string[];
  additionalNotes: string;
  tripName: string | null;
  createdAt: string;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2d5016 0%, #3a6b1f 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">New Trip Customization Request</h1>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">Eraya Wellness Travels</p>
      </div>
      
      <div style="background: #f5f1e8; padding: 30px 20px;">
        ${data.tripName ? `<div style="background: #2d5016; color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; text-align: center;"><h2 style="margin: 0; font-size: 18px;">${data.tripName}</h2></div>` : ""}
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
          <h3 style="margin: 0 0 15px 0; color: #2d5016;">Contact Information</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          ${data.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${data.phone}</p>` : ""}
          <p style="margin: 5px 0;"><strong>Received:</strong> ${new Date(data.createdAt).toLocaleString()}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
          <h3 style="margin: 0 0 15px 0; color: #2d5016;">Trip Details</h3>
          <p style="margin: 5px 0;"><strong>Start Date:</strong> ${data.startDate}</p>
          <p style="margin: 5px 0;"><strong>End Date:</strong> ${data.endDate}</p>
          <p style="margin: 5px 0;"><strong>Group Size:</strong> ${data.groupSize}</p>
          <p style="margin: 5px 0;"><strong>Budget Range:</strong> ${data.budget}</p>
        </div>
        
        ${data.interests.length > 0 ? `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
          <h3 style="margin: 0 0 15px 0; color: #2d5016;">Interests</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${data.interests.map((interest) => `<span style="background: #f5f1e8; padding: 6px 12px; border-radius: 20px; font-size: 14px;">${interest}</span>`).join("")}
          </div>
        </div>
        ` : ""}
        
        ${data.additionalNotes ? `
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: #2d5016;">Additional Notes</h3>
          <p style="margin: 0; white-space: pre-wrap;">${data.additionalNotes}</p>
        </div>
        ` : ""}
      </div>
      
      <div style="background: #2d5016; color: white; padding: 15px 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
        <p style="margin: 0;">Please respond within 24 hours</p>
      </div>
    </div>
  `;
}

function generateAdminNotificationText(data: {
  name: string;
  email: string;
  phone: string | null;
  startDate: string;
  endDate: string;
  groupSize: string;
  budget: string;
  interests: string[];
  additionalNotes: string;
  tripName: string | null;
}): string {
  return `
New Trip Customization Request
${data.tripName ? `Trip: ${data.tripName}\n` : ""}
Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}\n` : ""}
Start Date: ${data.startDate}
End Date: ${data.endDate}
Group Size: ${data.groupSize}
Budget: ${data.budget}
${data.interests.length > 0 ? `Interests: ${data.interests.join(", ")}\n` : ""}
${data.additionalNotes ? `\nAdditional Notes:\n${data.additionalNotes}` : ""}
  `.trim();
}

function generateUserConfirmationHTML(name: string, tripName: string | null): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2d5016 0%, #3a6b1f 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Eraya Wellness Travels</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Trip Customization Request Received</p>
      </div>
      
      <div style="background: #f5f1e8; padding: 40px 20px; text-align: center;">
        <h2 style="color: #2d5016; margin-top: 0;">Thank You${tripName ? ` for Your Interest in ${tripName}` : ""}!</h2>
        <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
          Dear ${name},
        </p>
        <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
          We have received your trip customization request and are excited to help you plan your perfect journey. Our trip expert will review your preferences and contact you shortly to finalize your personalized itinerary.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5016; margin: 20px 0; text-align: left;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            In the meantime, feel free to explore our wellness travel packages and discover more transformative journeys we offer.
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

function generateUserConfirmationText(name: string, tripName: string | null): string {
  return `
Dear ${name},

Thank you${tripName ? ` for your interest in ${tripName}` : ""}!

We have received your trip customization request and are excited to help you plan your perfect journey. Our trip expert will review your preferences and contact you shortly to finalize your personalized itinerary.

In the meantime, feel free to explore our wellness travel packages and discover more transformative journeys we offer.

Best regards,
Eraya Wellness Travels Team

© ${new Date().getFullYear()} Eraya Wellness Travels. All rights reserved.
  `.trim();
}
