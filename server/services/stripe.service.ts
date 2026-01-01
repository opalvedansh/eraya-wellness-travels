import Stripe from "stripe";
import { prisma } from "./prisma";
import logger from "./logger";
import { sendEmail } from "./email";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

// Lazy initialization - only initialize when needed
let stripe: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!STRIPE_SECRET_KEY) {
    logger.error("STRIPE_SECRET_KEY is not configured");
    throw new Error("STRIPE_SECRET_KEY is required. Please add it to your .env file.");
  }

  if (!stripe) {
    stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });
    logger.info("✓ Stripe client initialized");
  }

  return stripe;
}

export interface CreateCheckoutSessionParams {
  bookingId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  itemName: string;
  guests: number;
}

/**
 * Create a Stripe Checkout Session for payment
 */
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<{ sessionId: string; sessionUrl: string }> {
  try {
    const {
      bookingId,
      amount,
      currency,
      customerEmail,
      customerName,
      itemName,
      guests,
    } = params;

    // Create checkout session
    const stripeClient = getStripeClient();
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      client_reference_id: bookingId, // Store booking ID for webhook
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: itemName,
              description: `Booking for ${guests} ${guests === 1 ? "guest" : "guests"}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/payment-cancel?booking_id=${bookingId}`,
      metadata: {
        bookingId,
        customerName,
        guests: guests.toString(),
      },
    });

    // Update booking with session ID
    await prisma.booking.update({
      where: { id: bookingId },
      data: { stripeSessionId: session.id },
    });

    logger.info(`Checkout session created`, {
      bookingId,
      sessionId: session.id,
      amount,
      currency,
    });

    return {
      sessionId: session.id,
      sessionUrl: session.url!,
    };
  } catch (error) {
    logger.error("Failed to create checkout session", {
      error: error instanceof Error ? error.message : String(error),
      bookingId: params.bookingId,
    });
    throw error;
  }
}

/**
 * Helper function to create payment history records
 */
async function createPaymentHistoryRecord(
  bookingId: string,
  eventType: string,
  status: string,
  amount?: number,
  currency?: string,
  stripeEventId?: string,
  metadata?: any
): Promise<void> {
  try {
    await prisma.paymentHistory.create({
      data: {
        bookingId,
        eventType,
        status,
        amount,
        currency,
        stripeEventId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
      },
    });
  } catch (error) {
    logger.error("Failed to create payment history record", {
      error: error instanceof Error ? error.message : String(error),
      bookingId,
      eventType,
    });
    // Don't throw - payment history is informational
  }
}


/**
 * Verify webhook signature from Stripe
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }

  try {
    const stripeClient = getStripeClient();
    return stripeClient.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    logger.error("Webhook signature verification failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error("Invalid webhook signature");
  }
}

/**
 * Handle successful checkout session completion
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  try {
    const bookingId = session.client_reference_id;

    if (!bookingId) {
      logger.error("No booking ID in checkout session", {
        sessionId: session.id,
      });
      return;
    }

    // Check if already processed (idempotency)
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!existingBooking) {
      logger.error("Booking not found for completed session", {
        bookingId,
        sessionId: session.id,
      });
      return;
    }

    // Skip if already marked as paid (idempotency check)
    if (existingBooking.paymentStatus === "paid") {
      logger.info("Booking already marked as paid, skipping duplicate webhook", {
        bookingId,
        sessionId: session.id,
      });
      return;
    }

    // Get payment intent to extract transaction ID
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    // Update booking to paid and confirmed
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: "paid",
        status: "confirmed",
        paymentIntentId: paymentIntentId || undefined,
        transactionId: paymentIntentId || session.id,
        updatedAt: new Date(),
      },
    });

    // Record payment history
    await createPaymentHistoryRecord(
      bookingId,
      "payment_succeeded",
      "completed",
      updatedBooking.amount,
      updatedBooking.currency,
      session.id,
      {
        sessionId: session.id,
        paymentIntentId,
        amount: updatedBooking.amount,
      }
    );

    logger.info("Booking payment confirmed", {
      bookingId,
      sessionId: session.id,
      transactionId: updatedBooking.transactionId,
    });

    // Send confirmation emails
    await sendBookingConfirmationEmails(updatedBooking);
  } catch (error) {
    logger.error("Failed to process checkout session completion", {
      error: error instanceof Error ? error.message : String(error),
      sessionId: session.id,
    });
    throw error;
  }
}

/**
 * Send booking confirmation emails to customer and admin
 */
async function sendBookingConfirmationEmails(booking: any): Promise<void> {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  try {
    // Send customer confirmation email
    const customerEmailHtml = generateCustomerConfirmationEmail(booking);
    await sendEmail({
      to: booking.email,
      subject: `Booking Confirmed – ${booking.itemName}`,
      html: customerEmailHtml,
      text: `Your booking for ${booking.itemName} has been confirmed! Booking ID: ${booking.id}`,
    });

    logger.info("Customer confirmation email sent", {
      bookingId: booking.id,
      customerEmail: booking.email,
    });

    // Send owner notification email
    if (ADMIN_EMAIL) {
      const ownerEmailHtml = generateOwnerNotificationEmail(booking);
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `New Booking Confirmed – ${booking.itemName} | ${booking.id}`,
        html: ownerEmailHtml,
        text: `New booking confirmed for ${booking.itemName}. Customer: ${booking.fullName}`,
      });

      logger.info("Owner notification email sent", {
        bookingId: booking.id,
        adminEmail: ADMIN_EMAIL,
      });
    }
  } catch (error) {
    logger.error("Failed to send booking confirmation emails", {
      error: error instanceof Error ? error.message : String(error),
      bookingId: booking.id,
    });
    // Don't throw - payment is already confirmed
  }
}

/**
 * Generate customer confirmation email HTML
 */
function generateCustomerConfirmationEmail(booking: any): string {
  const formattedDate = new Date(booking.travelDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2d5016 0%, #3a6b1f 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 32px;">🎉 Booking Confirmed!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your adventure awaits</p>
      </div>
      
      <div style="background: #f5f1e8; padding: 40px 20px;">
        <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #2d5016; margin-top: 0; margin-bottom: 20px;">Hello ${booking.fullName}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for booking with <strong>Eraya Wellness Travels</strong>. We're excited to have you join us on this incredible journey!
          </p>
          
          <div style="background: linear-gradient(135deg, #2d5016 0%, #3a6b1f 100%); color: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; font-size: 20px;">Trip Details</h3>
            <table style="width: 100%; color: white;">
              <tr>
                <td style="padding: 8px 0; font-size: 14px; opacity: 0.9;">Adventure:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${booking.itemName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; opacity: 0.9;">Location:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${booking.location}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; opacity: 0.9;">Duration:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${booking.duration}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; opacity: 0.9;">Travel Date:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; opacity: 0.9;">Number of Guests:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${booking.guests}</td>
              </tr>
              <tr style="border-top: 1px solid rgba(255,255,255,0.3);">
                <td style="padding: 15px 0 8px 0; font-size: 14px; opacity: 0.9;">Total Amount Paid:</td>
                <td style="padding: 15px 0 8px 0; font-weight: bold; text-align: right; font-size: 24px;">$${booking.amount.toFixed(2)} ${booking.currency.toUpperCase()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f8f8f8; border-left: 4px solid #2d5016; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Booking Reference:</strong> ${booking.id}
            </p>
          </div>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h3 style="color: #2d5016; margin-top: 0;">What's Next?</h3>
          <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
            <li>Our team will contact you within 24 hours with detailed itinerary</li>
            <li>You'll receive a comprehensive packing list and preparation guide</li>
            <li>Pre-trip briefing call will be scheduled closer to your travel date</li>
          </ul>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h3 style="color: #2d5016; margin-top: 0;">Need Assistance?</h3>
          <p style="color: #666; margin-bottom: 15px;">Our team is here to help!</p>
          <p style="color: #666; margin: 5px 0;">
            📧 Email: <a href="mailto:${process.env.ADMIN_EMAIL || "info@erayawellnesstravels.com"}" style="color: #2d5016; text-decoration: none;">${process.env.ADMIN_EMAIL || "info@erayawellnesstravels.com"}</a>
          </p>
          <p style="color: #666; margin: 5px 0;">
            📱 Phone: <a href="tel:+9779765548080" style="color: #2d5016; text-decoration: none;">+977 976-554-8080</a>
          </p>
        </div>
      </div>
      
      <div style="background: #2d5016; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
        <p style="margin: 0 0 10px 0;">
          © ${new Date().getFullYear()} Eraya Wellness Travels. All rights reserved.
        </p>
        <p style="margin: 0; opacity: 0.8;">
          Creating transformative travel experiences in the Himalayas
        </p>
      </div>
    </div>
  `;
}

/**
 * Generate owner notification email HTML
 */
function generateOwnerNotificationEmail(booking: any): string {
  const formattedDate = new Date(booking.travelDate).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const bookingDate = new Date(booking.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🎯 New Booking Alert</h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Payment confirmed and processed</p>
      </div>
      
      <div style="background: #f9fafb; padding: 30px 20px;">
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>⚡ Action Required:</strong> A new booking requires your attention and confirmation.
          </p>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #1e3a8a; margin-top: 0; margin-bottom: 20px; font-size: 20px;">Booking Information</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; width: 40%;">Booking ID:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: bold; font-family: monospace;">${booking.id}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Adventure:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: bold;">${booking.itemName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Type:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; text-transform: capitalize;">${booking.type}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Travel Date:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Number of Guests:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: bold;">${booking.guests}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Booking Date:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${bookingDate}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #1e3a8a; margin-top: 0; margin-bottom: 20px; font-size: 20px;">Customer Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; width: 40%;">Full Name:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: bold;">${booking.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Email:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <a href="mailto:${booking.email}" style="color: #1e3a8a; text-decoration: none;">${booking.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Phone:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">
                ${booking.phone || "Not provided"}
              </td>
            </tr>
          </table>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #1e3a8a; margin-top: 0; margin-bottom: 20px; font-size: 20px;">Payment Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; width: 40%;">Payment Status:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                  ✓ PAID
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Total Amount:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: bold; font-size: 18px;">
                $${booking.amount.toFixed(2)} ${booking.currency.toUpperCase()}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Price per Person:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">
                $${booking.price.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Transaction ID:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-family: monospace; font-size: 12px;">
                ${booking.transactionId || "Processing..."}
              </td>
            </tr>
          </table>
        </div>
        
        <div style="background: #2d5016; color: white; border-radius: 8px; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">
            Please follow up with ${booking.fullName} within 24 hours to confirm details and next steps.
          </p>
        </div>
      </div>
      
      <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
        <p style="margin: 0;">
          Eraya Wellness Travels - Admin Notification System
        </p>
      </div>
    </div>
  `;
}

/**
 * Create a refund for a booking
 */
export async function createRefund(
  bookingId: string,
  amount?: number,
  reason?: string
): Promise<{ success: boolean; refundId?: string; error?: string }> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.paymentStatus !== "paid") {
      return { success: false, error: "Booking has not been paid" };
    }

    if (!booking.paymentIntentId) {
      return { success: false, error: "No payment intent found for this booking" };
    }

    // Determine refund amount
    const refundAmount = amount || booking.amount;

    if (refundAmount > booking.amount) {
      return { success: false, error: "Refund amount exceeds payment amount" };
    }

    // Create refund in Stripe
    const stripeClient = getStripeClient();
    const refund = await stripeClient.refunds.create({
      payment_intent: booking.paymentIntentId,
      amount: Math.round(refundAmount * 100), // Convert to cents
      reason: reason === "duplicate" ? "duplicate" : reason === "fraudulent" ? "fraudulent" : "requested_by_customer",
      metadata: {
        bookingId,
        refundReason: reason || "customer_request",
      },
    });

    // Determine refund status
    const isFullRefund = refundAmount >= booking.amount;
    const newRefundStatus = isFullRefund ? "full" : "partial";
    const newPaymentStatus = isFullRefund ? "refunded" : "paid";

    // Update booking
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        refundStatus: newRefundStatus,
        refundAmount: (booking.refundAmount || 0) + refundAmount,
        refundReason: reason || "customer_request",
        paymentStatus: newPaymentStatus,
        status: isFullRefund ? "cancelled" : booking.status,
      },
    });

    // Record in payment history
    await createPaymentHistoryRecord(
      bookingId,
      isFullRefund ? "refunded" : "refund_partial",
      "completed",
      refundAmount,
      booking.currency,
      refund.id,
      {
        refundId: refund.id,
        reason,
        isFullRefund,
      }
    );

    // Send refund confirmation email
    await sendRefundConfirmationEmail(booking, refundAmount, isFullRefund);

    logger.info("Refund processed successfully", {
      bookingId,
      refundId: refund.id,
      amount: refundAmount,
      isFullRefund,
    });

    return { success: true, refundId: refund.id };
  } catch (error) {
    logger.error("Failed to process refund", {
      error: error instanceof Error ? error.message : String(error),
      bookingId,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process refund",
    };
  }
}

/**
 * Handle payment failures
 */
export async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  try {
    // Find booking by payment intent ID
    const booking = await prisma.booking.findFirst({
      where: { paymentIntentId: paymentIntent.id },
    });

    if (!booking) {
      logger.warn("No booking found for failed payment intent", {
        paymentIntentId: paymentIntent.id,
      });
      return;
    }

    // Update booking status
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: "failed",
      },
    });

    // Record in payment history
    await createPaymentHistoryRecord(
      booking.id,
      "payment_failed",
      "failed",
      booking.amount,
      booking.currency,
      paymentIntent.id,
      {
        error: paymentIntent.last_payment_error?.message,
        failureCode: paymentIntent.last_payment_error?.code,
      }
    );

    // Send payment failure notification
    await sendPaymentFailureEmail(booking, paymentIntent.last_payment_error?.message);

    logger.info("Payment failure processed", {
      bookingId: booking.id,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    logger.error("Failed to handle payment failure", {
      error: error instanceof Error ? error.message : String(error),
      paymentIntentId: paymentIntent.id,
    });
  }
}

/**
 * Get payment history for a booking
 */
export async function getPaymentHistory(bookingId: string) {
  try {
    const history = await prisma.paymentHistory.findMany({
      where: { bookingId },
      orderBy: { createdAt: "desc" },
    });

    return history;
  } catch (error) {
    logger.error("Failed to fetch payment history", {
      error: error instanceof Error ? error.message : String(error),
      bookingId,
    });
    throw error;
  }
}

/**
 * Create a Payment Intent (for custom checkout flows)
 */
export interface CreatePaymentIntentParams {
  bookingId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  paymentMethodId?: string;
}

export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  try {
    const { bookingId, amount, currency, customerEmail, paymentMethodId } = params;

    const stripeClient = getStripeClient();

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      receipt_email: customerEmail,
      metadata: {
        bookingId,
      },
    };

    if (paymentMethodId) {
      paymentIntentParams.payment_method = paymentMethodId;
      paymentIntentParams.confirm = true;
    }

    const paymentIntent = await stripeClient.paymentIntents.create(paymentIntentParams);

    // Update booking with payment intent ID
    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentIntentId: paymentIntent.id },
    });

    // Record in payment history
    await createPaymentHistoryRecord(
      bookingId,
      "payment_initiated",
      "pending",
      amount,
      currency,
      paymentIntent.id,
      {
        paymentIntentId: paymentIntent.id,
        paymentMethodId,
      }
    );

    logger.info("Payment intent created", {
      bookingId,
      paymentIntentId: paymentIntent.id,
      amount,
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    logger.error("Failed to create payment intent", {
      error: error instanceof Error ? error.message : String(error),
      bookingId: params.bookingId,
    });
    throw error;
  }
}

/**
 * Send refund confirmation email
 */
async function sendRefundConfirmationEmail(
  booking: any,
  refundAmount: number,
  isFullRefund: boolean
): Promise<void> {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2d5016 0%, #3a6b1f 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 32px;">Refund Processed</h1>
        </div>
        
        <div style="background: #f5f1e8; padding: 40px 20px;">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #2d5016; margin-top: 0;">Hello ${booking.fullName},</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your ${isFullRefund ? "full" : "partial"} refund has been processed successfully.
            </p>
            
            <div style="background: linear-gradient(135deg, #2d5016 0%, #3a6b1f 100%); color: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Refund Amount</p>
              <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold;">$${refundAmount.toFixed(2)} ${booking.currency.toUpperCase()}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              The refund will appear in your original payment method within 5-10 business days.
            </p>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Booking Reference:</strong> ${booking.id}
            </p>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: booking.email,
      subject: `Refund Processed – ${booking.itemName}`,
      html: emailHtml,
      text: `Your ${isFullRefund ? "full" : "partial"} refund of $${refundAmount.toFixed(2)} has been processed. Booking ID: ${booking.id}`,
    });

    logger.info("Refund confirmation email sent", {
      bookingId: booking.id,
      email: booking.email,
      refundAmount,
    });
  } catch (error) {
    logger.error("Failed to send refund confirmation email", {
      error: error instanceof Error ? error.message : String(error),
      bookingId: booking.id,
    });
  }
}

/**
 * Send payment failure notification email
 */
async function sendPaymentFailureEmail(
  booking: any,
  errorMessage?: string
): Promise<void> {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 32px;">Payment Failed</h1>
        </div>
        
        <div style="background: #f5f1e8; padding: 40px 20px;">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #2d5016; margin-top: 0;">Hello ${booking.fullName},</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Unfortunately, your payment for <strong>${booking.itemName}</strong> could not be processed.
            </p>
            
            ${errorMessage ? `
              <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  <strong>Error:</strong> ${errorMessage}
                </p>
              </div>
            ` : ""}
            
            <p style="color: #666; font-size: 14px;">
              Please try again or contact us for assistance.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${FRONTEND_URL}/my-bookings" style="background: #2d5016; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Retry Payment
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: booking.email,
      subject: `Payment Failed – ${booking.itemName}`,
      html: emailHtml,
      text: `Your payment for ${booking.itemName} failed. ${errorMessage ? `Error: ${errorMessage}` : ""} Please try again.`,
    });

    logger.info("Payment failure email sent", {
      bookingId: booking.id,
      email: booking.email,
    });
  } catch (error) {
    logger.error("Failed to send payment failure email", {
      error: error instanceof Error ? error.message : String(error),
      bookingId: booking.id,
    });
  }
}
