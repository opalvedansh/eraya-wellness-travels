import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env file
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

function validateDatabaseUrl() {
    console.log('🔍 Validating DATABASE_URL format...\n');

    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        console.error('❌ DATABASE_URL is not set in .env file');
        process.exit(1);
    }

    // Parse the URL
    try {
        const url = new URL(dbUrl);

        console.log('✅ DATABASE_URL is set');
        console.log('\n📋 Connection Details (credentials hidden):');
        console.log('   Protocol:', url.protocol);
        console.log('   Username:', url.username ? '***' : 'MISSING');
        console.log('   Password:', url.password ? '***' : 'MISSING');
        console.log('   Host:', url.hostname);
        console.log('   Port:', url.port || 'default');
        console.log('   Database:', url.pathname.slice(1));
        console.log('   Parameters:', url.search);

        // Validation checks
        console.log('\n🔍 Validation Checks:');

        let hasIssues = false;

        if (url.protocol !== 'postgresql:') {
            console.error('   ❌ Protocol should be "postgresql:" not "' + url.protocol + '"');
            hasIssues = true;
        } else {
            console.log('   ✅ Protocol is correct');
        }

        if (!url.username) {
            console.error('   ❌ Username is missing');
            hasIssues = true;
        } else if (!url.username.startsWith('postgres')) {
            console.warn('   ⚠️  Username should typically start with "postgres"');
            console.log('      Current username starts with:', url.username.substring(0, 8) + '...');
        } else {
            console.log('   ✅ Username format looks correct');
        }

        if (!url.password) {
            console.error('   ❌ Password is missing');
            hasIssues = true;
        } else {
            console.log('   ✅ Password is present');

            // Check for unencoded special characters
            const specialChars = ['@', '#', '$', '!', '^', '&', '*', '(', ')', '[', ']', '{', '}', '|', '\\', '/', '?', '<', '>', ',', ' '];
            const hasSpecialChars = specialChars.some(char => url.password.includes(char));

            if (hasSpecialChars) {
                console.warn('   ⚠️  Password might contain special characters that need URL encoding');
            }
        }

        if (!url.hostname.includes('supabase.com')) {
            console.warn('   ⚠️  Host doesn\'t appear to be a Supabase host');
            console.log('      Expected format: aws-0-[region].pooler.supabase.com or db.[project-ref].supabase.co');
        } else {
            console.log('   ✅ Host appears to be Supabase');
        }

        if (!url.port) {
            console.warn('   ⚠️  Using default port (5432)');
        } else if (url.port === '5432') {
            console.log('   ✅ Port 5432 (Direct connection - good for local dev)');
        } else if (url.port === '6543') {
            console.log('   ✅ Port 6543 (Pooler connection - good for production)');
        } else {
            console.warn('   ⚠️  Unusual port:', url.port);
        }

        if (hasIssues) {
            console.log('\n❌ Issues found with DATABASE_URL format');
            console.log('\n📝 Expected format:');
            console.log('   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres');
            console.log('\n💡 Get the correct URL from Supabase Dashboard → Settings → Database → Connection String');
            process.exit(1);
        } else {
            console.log('\n✅ DATABASE_URL format looks correct!');
            console.log('\n💡 If connection still fails, the issue is likely:');
            console.log('   1. Incorrect password (check Supabase dashboard)');
            console.log('   2. Password contains special characters that need URL encoding');
            console.log('   3. Database user doesn\'t exist or was deleted');
            console.log('\n🔧 Next steps:');
            console.log('   1. Go to Supabase Dashboard → Settings → Database');
            console.log('   2. Copy the "Connection string" (URI format)');
            console.log('   3. Replace [YOUR-PASSWORD] with your actual database password');
            console.log('   4. If password has special chars, use URL encoding tool');
        }

    } catch (error) {
        console.error('❌ Invalid DATABASE_URL format');
        console.error('   Error:', error instanceof Error ? error.message : error);
        console.log('\n📝 Expected format:');
        console.log('   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres');
        process.exit(1);
    }
}

validateDatabaseUrl();
