#!/usr/bin/env tsx
/**
 * Make a user an admin
 * Usage: tsx scripts/make-admin.ts your-email@example.com
 */

import { prisma } from "../server/services/prisma";

async function makeAdmin(email: string) {
    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!existingUser) {
            console.error(`❌ User with email "${email}" not found`);
            console.log("\n💡 Make sure the user has signed up first!");
            process.exit(1);
        }

        // Make them admin
        const user = await prisma.user.update({
            where: { email },
            data: { isAdmin: true },
        });

        console.log(`✅ Success! ${user.email} is now an admin`);
        console.log(`\nUser details:`);
        console.log(`  Name: ${user.name || "N/A"}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Admin: ${user.isAdmin ? "Yes" : "No"}`);
        console.log(`  Created: ${user.createdAt.toLocaleString()}`);

        console.log(`\n🎉 ${user.name || user.email} can now access the admin panel!`);
        console.log(`   Admin URL: https://your-domain.com/admin`);

    } catch (error) {
        console.error("❌ Error making user admin:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Get email from command line
const email = process.argv[2];

if (!email) {
    console.error("❌ Please provide an email address");
    console.log("\nUsage:");
    console.log("  tsx scripts/make-admin.ts your-email@example.com");
    console.log("\nOr with Railway:");
    console.log("  railway run tsx scripts/make-admin.ts your-email@example.com");
    process.exit(1);
}

if (!email.includes("@")) {
    console.error("❌ Please provide a valid email address");
    process.exit(1);
}

makeAdmin(email);
