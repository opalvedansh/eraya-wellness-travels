#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

console.log('\n🔍 DATABASE_URL Analysis\n');
console.log('='.repeat(70));

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.log('❌ DATABASE_URL not found in .env');
    process.exit(1);
}

const url = new URL(dbUrl);

// Mask password but show pattern
const passwordPattern = url.password.replace(/./g, '*');
const usernamePattern = url.username;

console.log('\n📋 Your Current Configuration:');
console.log(`   Username: ${usernamePattern}`);
console.log(`   Password: ${passwordPattern} (${url.password.length} characters)`);
console.log(`   Host: ${url.hostname}`);
console.log(`   Port: ${url.port}`);
console.log(`   Database: ${url.pathname.slice(1)}`);

console.log('\n' + '='.repeat(70));
console.log('⚠️  IMPORTANT: Supabase Connection String Format');
console.log('='.repeat(70));

console.log('\nFor Supabase, there are TWO different connection formats:\n');

console.log('1️⃣  CONNECTION POOLER (Port 6543) - For Production/Railway:');
console.log('   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres');
console.log('   Note: Username must be "postgres.[PROJECT-REF]" format\n');

console.log('2️⃣  DIRECT CONNECTION (Port 5432) - For Local Development:');
console.log('   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
console.log('   Note: Username is just "postgres"\n');

console.log('='.repeat(70));

// Detect which format they're using
if (url.hostname.includes('pooler.supabase.com')) {
    console.log('\n✅ You are using POOLER format');

    if (url.username.includes('.')) {
        console.log(`✅ Username format looks correct: ${url.username.substring(0, 15)}...`);
    } else {
        console.log('❌ ERROR: For pooler connection, username MUST be "postgres.PROJECT-REF"');
        console.log(`   Your username is: ${url.username}`);
        console.log('   This is likely the cause of "Tenant or user not found" error!');
    }

} else if (url.hostname.includes('supabase.co')) {
    console.log('\n✅ You are using DIRECT CONNECTION format');

    if (url.username === 'postgres') {
        console.log('✅ Username format is correct');
    } else {
        console.log('❌ ERROR: For direct connection, username should be just "postgres"');
        console.log(`   Your username is: ${url.username}`);
    }
}

console.log('\n' + '='.repeat(70));
console.log('🔧 HOW TO FIX:');
console.log('='.repeat(70));

console.log('\n1. Go to: https://supabase.com/dashboard');
console.log('2. Open your project');
console.log('3. Go to: Settings → Database');
console.log('4. Scroll to "Connection string" section');
console.log('5. Click "URI" tab');
console.log('6. You will see TWO different URLs:\n');
console.log('   • Session mode (port 5432) - USE THIS FOR LOCAL DEV');
console.log('   • Transaction mode (port 6543) - Use for production\n');
console.log('7. Copy the ENTIRE connection string');
console.log('8. Replace [YOUR-PASSWORD] with your actual password');
console.log('9. Update your .env file\n');

console.log('='.repeat(70));
console.log('💡 If you don\'t remember your password:');
console.log('='.repeat(70));
console.log('\n   Settings → Database → Database Settings → Reset Database Password\n');
console.log('='.repeat(70));

