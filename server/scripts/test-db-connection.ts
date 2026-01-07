import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
    console.log('🔍 Testing database connection...\n');

    try {
        // Test 1: Basic connection
        console.log('Test 1: Attempting to connect to database...');
        await prisma.$connect();
        console.log('✅ Successfully connected to database!\n');

        // Test 2: Query database version
        console.log('Test 2: Querying database version...');
        const result = await prisma.$queryRaw`SELECT version()`;
        console.log('✅ Database version:', result);
        console.log('');

        // Test 3: Count users
        console.log('Test 3: Counting users in database...');
        const userCount = await prisma.user.count();
        console.log(`✅ Found ${userCount} users in database\n`);

        // Test 4: Count tours
        console.log('Test 4: Counting tours in database...');
        const tourCount = await prisma.tour.count();
        console.log(`✅ Found ${tourCount} tours in database\n`);

        console.log('🎉 All database tests passed successfully!');

    } catch (error) {
        console.error('❌ Database connection failed!');
        console.error('\nError details:');
        console.error(error);

        if (error instanceof Error) {
            console.error('\nError message:', error.message);

            if (error.message.includes('Tenant or user not found')) {
                console.error('\n💡 Fix: Your database credentials are incorrect.');
                console.error('   Check your DATABASE_URL in .env file');
                console.error('   Make sure the password is correct and URL-encoded');
            } else if (error.message.includes('ECONNREFUSED')) {
                console.error('\n💡 Fix: Cannot connect to database host.');
                console.error('   Check if the database URL and port are correct');
            } else if (error.message.includes('timeout')) {
                console.error('\n💡 Fix: Connection timeout.');
                console.error('   Check your internet connection and firewall settings');
            }
        }

        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
