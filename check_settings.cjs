
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSettings() {
    try {
        const settings = await prisma.siteSettings.findMany();
        console.log("Current Site Settings:", JSON.stringify(settings, null, 2));
    } catch (e) {
        console.error("Error fetching settings:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkSettings();
