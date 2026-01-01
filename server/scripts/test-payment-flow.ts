
import "dotenv/config";
import { getPrismaClient } from "../services/prisma";
import { createCheckoutSession } from "../services/stripe.service";

async function main() {
    console.log("Starting payment flow test...");

    // 1. Initialize Prisma
    const prisma = await getPrismaClient();
    console.log("Prisma initialized.");

    // 2. Get a user
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error("No users found in database. Please sign up a user first via the app.");
        return;
    }
    console.log(`Found user: ${user.email} (${user.id})`);

    // 3. Create a test booking
    // We use a future date
    const travelDate = new Date();
    travelDate.setDate(travelDate.getDate() + 30);

    const booking = await prisma.booking.create({
        data: {
            userId: user.id,
            type: "trek",
            itemName: "Test Trek Integration",
            itemSlug: "test-trek-integration",
            location: "Nepal",
            duration: "5 days",
            // Ensure we use a valid price that meets Stripe minimums (e.g. > $0.50)
            price: 100,
            travelDate: travelDate,
            fullName: user.fullName || "Test User",
            email: user.email,
            phone: "1234567890",
            guests: 2,
            amount: 200, // 100 * 2
            currency: "usd",
            status: "pending",
            paymentStatus: "pending",
        }
    });
    console.log(`Created test booking: ${booking.id}`);

    // 4. Create Checkout Session
    try {
        console.log("Attempting to create Stripe checkout session...");
        const result = await createCheckoutSession({
            bookingId: booking.id,
            amount: booking.amount,
            currency: booking.currency,
            customerEmail: booking.email,
            customerName: booking.fullName,
            itemName: booking.itemName,
            guests: booking.guests,
        });

        console.log("\n---------------------------------------------------");
        console.log("SUCCESS! Stripe Checkout Session Created:");
        console.log(`Session ID: ${result.sessionId}`);
        console.log(`URL: ${result.sessionUrl}`);
        console.log("---------------------------------------------------\n");
        console.log("Test passed. You can verify the URL manually.");

    } catch (error) {
        console.error("Failed to create checkout session:", error);
    } finally {
        // Cleanup
        try {
            await prisma.booking.delete({ where: { id: booking.id } });
            console.log("Cleaned up test booking.");
        } catch (e) {
            console.error("Error cleaning up:", e);
        }
        await prisma.$disconnect();
        process.exit(0);
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
