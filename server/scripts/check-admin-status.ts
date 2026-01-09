
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function checkAdmin(email: string) {
    try {
        console.log(`Checking admin status for: ${email}`);

        // Explicitly log the DATABASE_URL host (masking credentials)
        const dbUrl = process.env.DATABASE_URL || "";
        try {
            const url = new URL(dbUrl);
            console.log(`Connecting to host: ${url.hostname}`);
        } catch (e) {
            console.log("Could not parse DATABASE_URL");
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log(`❌ User not found: ${email}`);
        } else {
            console.log(`✅ User found: ${user.id}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Is Admin: ${user.isAdmin}`);

            if (user.isAdmin) {
                console.log("🎉 User HAS admin privileges.");
            } else {
                console.log("⚠️ User does NOT have admin privileges.");
            }
        }
    } catch (error) {
        console.error("Error checking admin status:", error);
    } finally {
        await prisma.$disconnect();
    }
}

// Check for the email from the earlier screenshot/context
const email = process.argv[2] || "erayawellnesstravel@gmail.com";
checkAdmin(email);
