#!/usr/bin/env node

// Test if the Supabase project exists and is accessible
import * as https from 'https';

const projectRef = 'uznouhdvxggwcrekufnf';

console.log('\n🔍 Testing Supabase Project Status...\n');
console.log(`Project Reference: ${projectRef}\n`);

// Test 1: Check if project REST API is accessible
const apiUrl = `https://${projectRef}.supabase.co/rest/v1/`;

console.log('Test 1: Checking if project exists and is accessible...');
console.log(`Testing: ${apiUrl}\n`);

https.get(apiUrl, (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    if (res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 200) {
        console.log('✅ Project EXISTS and is ACTIVE!');
        console.log('   (401/403/200 response means the project is online)\n');

        console.log('This confirms your Supabase project is working.');
        console.log('The database connection issue is ONLY about credentials.\n');

        console.log('🔧 SOLUTION:');
        console.log('   1. Go to: https://supabase.com/dashboard/project/' + projectRef);
        console.log('   2. Settings → Database → Database Settings');
        console.log('   3. Click "Reset database password"');
        console.log('   4. Copy the NEW password');
        console.log('   5. Run: npx tsx server/scripts/generate-db-url.ts');
        console.log('   6. Use the new password\n');

    } else if (res.statusCode === 404) {
        console.log('❌ Project NOT FOUND!');
        console.log('   Your project may have been deleted or paused.\n');
        console.log('💡 In this case, you should create a new Supabase project.');
    } else {
        console.log('⚠️  Unexpected status code:', res.statusCode);
    }

}).on('error', (error) => {
    console.error('❌ Error connecting to Supabase:', error.message);
    console.log('\n💡 This could mean:');
    console.log('   - Internet connection issue');
    console.log('   - Project was deleted');
    console.log('   - Supabase is down (unlikely)');
});
