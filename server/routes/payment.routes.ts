import { Router, Request, Response } from "express";
import { prisma } from "../services/prisma";
import {
    createCheckoutSession,
    verifyWebhookSignature,
    handleCheckoutSessionCompleted,
    createRefund,
    getPaymentHistory,
    handlePaymentFailed,
} from "../services/stripe.service";
import logger from "../services/logger";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { createCheckoutSessionSchema } from "../validation/schemas";
import Stripe from "stripe";

const router = Router();

/**
 * POST /api/create-checkout-session
 * Create a Stripe checkout session for a booking
 * Requires authentication
 */
router.post(
    "/create-checkout-session",
    authenticate,
    validateRequest(createCheckoutSessionSchema),
    async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            const { bookingId, guests } = req.body;

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            // Fetch booking with its associated user
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { user: true },
            });

            if (!booking) {
                logger.error("Booking not found for checkout session", {
                    bookingId,
                    userId,
                });
                return res.status(404).json({ error: "Booking not found" });
            }

            // Verify booking belongs to authenticated user
            // Compare the authenticated userId OR the user emails (handles userId mismatches)
            const authenticatedUser = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!authenticatedUser) {
                logger.error("Authenticated user not found", { userId });
                return res.status(401).json({ error: "Unauthorized" });
            }

            // Check ownership: either userId matches OR emails match (same person, different accounts)
            const ownershipVerified =
                booking.userId === userId ||
                booking.user.email === authenticatedUser.email;

            if (!ownershipVerified) {
                logger.error("Booking ownership verification failed", {
                    bookingId,
                    authenticatedUserId: userId,
                    bookingUserId: booking.userId,
                    bookingUserEmail: booking.user.email,
                    authenticatedUserEmail: authenticatedUser.email
                });
                return res.status(403).json({ error: "Unauthorized: booking does not belong to you" });
            }

            logger.info("Booking found and verified for checkout session", {
                bookingId: booking.id,
                bookingUserId: booking.userId,
                authenticatedUserId: userId,
                paymentStatus: booking.paymentStatus,
                ownershipMethod: booking.userId === userId ? 'userId match' : 'email match'
            });

            // Verify booking is in pending payment status
            if (booking.paymentStatus !== "pending") {
                return res.status(400).json({
                    error: "Booking payment already processed",
                    paymentStatus: booking.paymentStatus,
                });
            }

            // Calculate total amount
            const totalAmount = booking.price * guests;

            // Update booking with guest count and amount
            await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    guests,
                    amount: totalAmount,
                },
            });

            // Create Stripe checkout session
            const { sessionUrl } = await createCheckoutSession({
                bookingId,
                amount: totalAmount,
                currency: "usd",
                customerEmail: booking.email,
                customerName: booking.fullName,
                itemName: booking.itemName,
                guests,
            });

            logger.info("Checkout session created successfully", {
                bookingId,
                userId,
                amount: totalAmount,
            });

            return res.json({
                success: true,
                sessionUrl,
            });
        } catch (error) {
            logger.error("Error creating checkout session", {
                error: error instanceof Error ? error.message : String(error),
                userId: req.user?.userId,
            });

            return res.status(500).json({
                error: "Failed to create checkout session",
                message:
                    error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }
);

/**
 * POST /api/stripe-webhook
 * Handle Stripe webhook events
 * NO authentication - verified via webhook signature
 */
router.post("/stripe-webhook", async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
        logger.warn("Webhook received without signature");
        return res.status(400).json({ error: "Missing signature" });
    }

    try {
        // Verify webhook signature
        // Note: req.body should be raw buffer, not JSON parsed
        const event = verifyWebhookSignature(req.body, signature);

        logger.info("Webhook event received", {
            type: event.type,
            id: event.id,
        });

        // Handle the event
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutSessionCompleted(session);
                break;
            }

            case "payment_intent.succeeded": {
                logger.info("Payment intent succeeded", {
                    paymentIntentId: event.data.object.id,
                });
                // Already handled by checkout.session.completed
                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentFailed(paymentIntent);
                break;
            }

            default:
                logger.info("Unhandled webhook event type", { type: event.type });
        }

        // Return 200 to acknowledge receipt
        return res.json({ received: true });
    } catch (error) {
        logger.error("Webhook processing error", {
            error: error instanceof Error ? error.message : String(error),
        });

        return res.status(400).json({
            error: "Webhook processing failed",
            message: error instanceof Error ? error.message : String(error),
        });
    }
});

/**
 * POST /api/bookings/:id/refund
 * Create a refund for a booking
 * Requires authentication
 */
router.post("/bookings/:id/refund", authenticate, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const { amount, reason } = req.body;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Verify booking belongs to user
        const booking = await prisma.booking.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Process refund
        const result = await createRefund(id, amount, reason);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        logger.info("Refund request processed", {
            bookingId: id,
            userId,
            refundId: result.refundId,
        });

        return res.json({
            success: true,
            refundId: result.refundId,
            message: "Refund processed successfully",
        });
    } catch (error) {
        logger.error("Error processing refund", {
            error: error instanceof Error ? error.message : String(error),
            bookingId: req.params.id,
            userId: req.user?.userId,
        });

        return res.status(500).json({
            error: "Failed to process refund",
            message:
                error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
});

/**
 * GET /api/bookings/:id/payment-history
 * Get payment history for a booking
 * Requires authentication
 */
router.get("/bookings/:id/payment-history", authenticate, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Verify booking belongs to user
        const booking = await prisma.booking.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Get payment history
        const history = await getPaymentHistory(id);

        logger.info("Payment history fetched", {
            bookingId: id,
            userId,
            recordCount: history.length,
        });

        return res.json({ history });
    } catch (error) {
        logger.error("Error fetching payment history", {
            error: error instanceof Error ? error.message : String(error),
            bookingId: req.params.id,
            userId: req.user?.userId,
        });

        return res.status(500).json({
            error: "Failed to fetch payment history",
            message:
                error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
});

export default router;
