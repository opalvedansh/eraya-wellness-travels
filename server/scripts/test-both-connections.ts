import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

const currentUrl = process.env.DATABASE_URL!;

async function testConnection(url: string, name: string) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔍 Testing: ${name}`);
    console.log(`${'='.repeat(60)}\n`);

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: url
            }
        },
        log: ['error'],
    });

    try {
        console.log('Attempting to connect...');
        await prisma.$connect();
        console.log('✅ Connection successful!');

        const userCount = await prisma.user.count();
        console.log(`✅ Query successful! Found ${userCount} users`);

        await prisma.$disconnect();
        return true;
    } catch (error) {
        console.error('❌ Connection failed!');
        if (error instanceof Error) {
            console.error('Error:', error.message);
        }
        await prisma.$disconnect();
        return false;
    }
}

async function testAllConnections() {
    console.log('\n🚀 Testing different connection configurations...\n');

    // Parse current URL
    const url = new URL(currentUrl);
    const baseUrl = currentUrl.split('@')[0]; // Get everything before @
    const hostAndPath = currentUrl.split('@')[1]; // Get everything after @

    const configs = [
        {
            name: 'Current Config (Port 6543 - Pooler)',
            url: currentUrl
        },
        {
            name: 'Direct Connection (Port 5432)',
            url: currentUrl.replace(':6543/', ':5432/')
        },
        {
            name: 'Pooler with pgbouncer param (Port 6543)',
            url: currentUrl.includes('?')
                ? `${currentUrl}&pgbouncer=true&connection_limit=1`
                : `${currentUrl}?pgbouncer=true&connection_limit=1`
        },
        {
            name: 'Direct with sslmode (Port 5432)',
            url: currentUrl.replace(':6543/', ':5432/').split('?')[0] + '?sslmode=require'
        }
    ];

    const results: { name: string; success: boolean }[] = [];

    for (const config of configs) {
        const success = await testConnection(config.url, config.name);
        results.push({ name: config.name, success });
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 RESULTS SUMMARY');
    console.log(`${'='.repeat(60)}\n`);

    results.forEach(result => {
        console.log(`${result.success ? '✅' : '❌'} ${result.name}`);
    });

    const successful = results.filter(r => r.success);

    if (successful.length > 0) {
        console.log('\n🎉 SUCCESS! Working configuration(s) found!\n');
        console.log('💡 Recommendation:');
        console.log(`   Update your .env DATABASE_URL to use: ${successful[0].name}\n`);

        if (successful[0].name.includes('5432')) {
            console.log('   For LOCAL development, use port 5432 (Direct connection)');
            console.log('   For PRODUCTION (Railway), use port 6543 with pgbouncer=true\n');
        }
    } else {
        console.log('\n❌ None of the configurations worked.\n');
        console.log('💡 This means one of the following:');
        console.log('   1. The password is incorrect (even if it looks right)');
        console.log('   2. The username format is wrong');
        console.log('   3. The database project/user doesn\'t exist');
        console.log('   4. Your IP is blocked by Supabase');
        console.log('\n🔧 Next steps:');
        console.log('   1. Go to Supabase Dashboard → Settings → Database');
        console.log('   2. Try resetting your database password');
        console.log('   3. Verify the connection string under "Connection string" tab');
        console.log('   4. Check if your IP needs to be whitelisted\n');
    }
}

testAllConnections().catch(console.error);
