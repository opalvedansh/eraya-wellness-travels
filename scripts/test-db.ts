import { PrismaClient } from '@prisma/client';

async function main() {
    console.log('🔍 Database Diagnostic Tool\n');
    console.log('='.repeat(50));

    const databaseUrl = process.env.DATABASE_URL;

    // Check environment
    console.log('\n📋 Environment Check:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
    console.log(`   DATABASE_URL: ${databaseUrl ? '✓ Set' : '✗ Not set'}`);

    if (!databaseUrl) {
        console.error('\n❌ DATABASE_URL is not set!');
        console.error('   Please set it in your .env file or environment variables.\n');
        process.exit(1);
    }

    // Parse URL info
    try {
        const url = new URL(databaseUrl);
        console.log(`   Database Host: ${url.hostname}`);
        console.log(`   Database Port: ${url.port || '5432'}`);
        console.log(`   Database Name: ${url.pathname.substring(1)}`);
        console.log(`   Database User: ${url.username}`);
    } catch (error) {
        console.error(`   ⚠️  Could not parse DATABASE_URL: ${error}`);
    }

    // Initialize Prisma (use standard client without adapter for compatibility)
    console.log('\n🔌 Testing Database Connection...');
    const prisma = new PrismaClient({
        log: ['error'],
    });

    try {
        // Test connection
        await prisma.$queryRaw`SELECT 1`;
        console.log('   ✅ Connection successful!\n');

        // Get counts
        console.log('📊 Database Statistics:');
        console.log('   ' + '-'.repeat(40));

        const [
            tourCount,
            trekCount,
            userCount,
            adminUserCount,
            bookingCount,
            contactCount
        ] = await Promise.all([
            prisma.tour.count(),
            prisma.trek.count(),
            prisma.user.count(),
            prisma.user.count({ where: { isAdmin: true } }),
            prisma.booking.count(),
            prisma.contactSubmission.count(),
        ]);

        console.log(`   Tours:            ${tourCount}`);
        console.log(`   Treks:            ${trekCount}`);
        console.log(`   Users:            ${userCount}`);
        console.log(`   Admin Users:      ${adminUserCount}`);
        console.log(`   Bookings:         ${bookingCount}`);
        console.log(`   Contact Forms:    ${contactCount}`);

        // List admin users
        if (adminUserCount > 0) {
            console.log('\n👑 Admin Users:');
            const admins = await prisma.user.findMany({
                where: { isAdmin: true },
                select: { email: true, name: true, isVerified: true, createdAt: true }
            });
            admins.forEach(admin => {
                console.log(`   • ${admin.email}`);
                console.log(`     Name: ${admin.name || 'Not set'}`);
                console.log(`     Verified: ${admin.isVerified ? '✓' : '✗'}`);
                console.log(`     Created: ${admin.createdAt.toLocaleDateString()}`);
            });
        } else {
            console.log('\n⚠️  No admin users found!');
        }

        // List featured content
        if (tourCount > 0) {
            console.log('\n🌟 Featured Tours:');
            const featuredTours = await prisma.tour.findMany({
                where: { isFeatured: true, isActive: true },
                select: { name: true, slug: true, price: true }
            });
            if (featuredTours.length > 0) {
                featuredTours.forEach(tour => {
                    console.log(`   • ${tour.name} ($${tour.price})`);
                });
            } else {
                console.log('   No featured tours found');
            }
        }

        if (trekCount > 0) {
            console.log('\n⛰️  Featured Treks:');
            const featuredTreks = await prisma.trek.findMany({
                where: { isFeatured: true, isActive: true },
                select: { name: true, slug: true, price: true, altitude: true }
            });
            if (featuredTreks.length > 0) {
                featuredTreks.forEach(trek => {
                    console.log(`   • ${trek.name} ($${trek.price}) - ${trek.altitude || 'N/A'}`);
                });
            } else {
                console.log('   No featured treks found');
            }
        }

        // Recommendations
        console.log('\n💡 Recommendations:');
        console.log('   ' + '-'.repeat(40));

        if (tourCount === 0) {
            console.log('   ⚠️  No tours found - run: pnpm db:seed');
        } else {
            console.log('   ✓ Tours are populated');
        }

        if (trekCount === 0) {
            console.log('   ⚠️  No treks found - run: pnpm db:seed');
        } else {
            console.log('   ✓ Treks are populated');
        }

        if (adminUserCount === 0) {
            console.log('   ⚠️  No admin users - run: tsx scripts/make-admin.ts <email>');
        } else {
            console.log('   ✓ Admin users exist');
        }

        console.log('\n✅ Diagnostic complete!\n');

    } catch (error) {
        console.error('\n❌ Database connection failed:');
        if (error instanceof Error) {
            console.error(`   ${error.message}\n`);
        } else {
            console.error(`   ${error}\n`);
        }
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
