
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const adminEmails = [
    'vedanshlovesmom88@gmail.com',
    'erayawellnesstravels@gmail.com'
];

async function main() {
    console.log('Promoting users to admin...');

    for (const email of adminEmails) {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                console.log(`User not found: ${email}`);
                // Optionally create the user if they don't exist?
                // For now, just log it. The user likely needs to sign up first.
                continue;
            }

            const updatedUser = await prisma.user.update({
                where: { email },
                data: { isAdmin: true },
            });

            console.log(`Successfully promoted ${email} to admin.`);
        } catch (error) {
            console.error(`Error processing ${email}:`, error);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
