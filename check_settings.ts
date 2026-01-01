
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkSettings() {
    const settings = await prisma.siteSettings.findMany();
    console.log("Current Site Settings:", JSON.stringify(settings, null, 2));
}

checkSettings()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
