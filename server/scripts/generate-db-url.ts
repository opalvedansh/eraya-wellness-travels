#!/usr/bin/env node

import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n' + '='.repeat(70));
console.log('🔧 Supabase DATABASE_URL Generator');
console.log('='.repeat(70));

console.log('\n📋 This tool will help you create a properly formatted DATABASE_URL\n');

console.log('First, get your info from Supabase Dashboard → Settings → Database:\n');

function question(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

async function generateDatabaseUrl() {
    try {
        const projectRef = await question('1. Enter your PROJECT-REF (e.g., uznouhdvxggwcrekufnf): ');
        const password = await question('2. Enter your database PASSWORD: ');
        const region = await question('3. Enter REGION (e.g., us-east-1): ');

        console.log('\n' + '='.repeat(70));
        console.log('📝 Generated DATABASE URLs:');
        console.log('='.repeat(70));

        // URL encode the password
        const encodedPassword = encodeURIComponent(password);

        // Generate both URLs
        const localUrl = `postgresql://postgres:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres`;
        const productionUrl = `postgresql://postgres.${projectRef}:${encodedPassword}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`;

        console.log('\n🏠 FOR LOCAL DEVELOPMENT (.env):');
        console.log('\nDATABASE_URL="' + localUrl + '"\n');

        console.log('🚀 FOR PRODUCTION/RAILWAY:');
        console.log('\nDATABASE_URL="' + productionUrl + '"\n');

        console.log('='.repeat(70));
        console.log('✅ Copy the appropriate URL to your .env file');
        console.log('='.repeat(70));

        if (password !== encodedPassword) {
            console.log('\n⚠️  NOTE: Your password contained special characters and was URL-encoded');
            console.log('   Original: ' + password.replace(/./g, '*'));
            console.log('   Encoded:  ' + encodedPassword.replace(/./g, '*'));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        rl.close();
    }
}

generateDatabaseUrl();
