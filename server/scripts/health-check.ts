#!/usr/bin/env node

// Comprehensive Supabase project health check
import * as https from 'https';
import * as net from 'net';

const projectRef = 'uznouhdvxggwcrekufnf';
const region = 'us-east-1';

console.log('\n' + '='.repeat(70));
console.log('🏥 SUPABASE PROJECT HEALTH CHECK');
console.log('='.repeat(70));
console.log(`\nProject: ${projectRef}`);
console.log(`Region: ${region}\n`);

// Test 1: REST API (indicates if project is active)
async function testRestAPI() {
    return new Promise((resolve) => {
        console.log('Test 1: REST API (Project Status)');
        console.log(`Testing: https://${projectRef}.supabase.co/rest/v1/`);

        https.get(`https://${projectRef}.supabase.co/rest/v1/`, (res) => {
            if ([200, 401, 403].includes(res.statusCode!)) {
                console.log(`✅ Status ${res.statusCode} - Project is ACTIVE\n`);
                resolve(true);
            } else if (res.statusCode === 404) {
                console.log('❌ Status 404 - Project NOT FOUND or DELETED\n');
                resolve(false);
            } else {
                console.log(`⚠️  Status ${res.statusCode} - Unexpected response\n`);
                resolve(false);
            }
        }).on('error', (error) => {
            console.log('❌ Error:', error.message, '\n');
            resolve(false);
        });
    });
}

// Test 2: Direct database connection (port 5432)
async function testDirectDB() {
    return new Promise((resolve) => {
        console.log('Test 2: Direct Database Connection (Port 5432)');
        console.log(`Testing: db.${projectRef}.supabase.co:5432`);

        const socket = net.createConnection({
            host: `db.${projectRef}.supabase.co`,
            port: 5432,
            timeout: 5000
        });

        socket.on('connect', () => {
            console.log('✅ Port 5432 is ACCESSIBLE\n');
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            console.log('❌ Connection TIMEOUT - Port may be blocked\n');
            socket.destroy();
            resolve(false);
        });

        socket.on('error', (error: any) => {
            console.log(`❌ Cannot connect: ${error.code}\n`);
            resolve(false);
        });
    });
}

// Test 3: Pooler connection (port 6543)
async function testPoolerDB() {
    return new Promise((resolve) => {
        console.log('Test 3: Pooler Database Connection (Port 6543)');
        console.log(`Testing: aws-0-${region}.pooler.supabase.com:6543`);

        const socket = net.createConnection({
            host: `aws-0-${region}.pooler.supabase.com`,
            port: 6543,
            timeout: 5000
        });

        socket.on('connect', () => {
            console.log('✅ Port 6543 is ACCESSIBLE\n');
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            console.log('❌ Connection TIMEOUT - Port may be blocked\n');
            socket.destroy();
            resolve(false);
        });

        socket.on('error', (error: any) => {
            console.log(`❌ Cannot connect: ${error.code}\n`);
            resolve(false);
        });
    });
}

async function runHealthCheck() {
    const apiOk = await testRestAPI();
    const directOk = await testDirectDB();
    const poolerOk = await testPoolerDB();

    console.log('='.repeat(70));
    console.log('📊 DIAGNOSIS');
    console.log('='.repeat(70));

    if (apiOk && !directOk && !poolerOk) {
        console.log('\n⚠️  PROJECT IS PAUSED OR DATABASE IS DISABLED\n');
        console.log('Your Supabase project exists, but the database is not accessible.');
        console.log('This happens when:\n');
        console.log('  1. Free tier projects are PAUSED due to inactivity');
        console.log('  2. Project is in process of restoration');
        console.log('  3. Database pooling is disabled\n');
        console.log('🔧 SOLUTION:\n');
        console.log('  1. Go to: https://supabase.com/dashboard/project/' + projectRef);
        console.log('  2. Check if there\'s a "Resume" or "Restore" button');
        console.log('  3. If paused, click to resume the project');
        console.log('  4. Wait a few minutes for it to fully restart\n');
        console.log('  ⚠️  If project cannot be resumed, you may need to create a new one.\n');

    } else if (apiOk && poolerOk && !directOk) {
        console.log('\n✅ DATABASE IS ACCESSIBLE VIA POOLER (Port 6543)\n');
        console.log('Direct connections (port 5432) are blocked, but pooler works.');
        console.log('This is common for Supabase projects.\n');
        console.log('🔧 SOLUTION:\n');
        console.log('  Use the POOLER connection in your .env:\n');
        console.log(`  DATABASE_URL="postgresql://postgres.${projectRef}:[PASSWORD]@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true"\n`);
        console.log('  Make sure to use the correct password!\n');

    } else if (apiOk && directOk) {
        console.log('\n✅ DATABASE IS ACCESSIBLE VIA DIRECT CONNECTION\n');
        console.log('The issue is likely an incorrect password.\n');
        console.log('🔧 SOLUTION:\n');
        console.log('  Reset your database password and try again.\n');

    } else if (!apiOk) {
        console.log('\n❌ PROJECT DOES NOT EXIST OR WAS DELETED\n');
        console.log('Your Supabase project is not accessible.\n');
        console.log('🔧 SOLUTION:\n');
        console.log('  Create a new Supabase project.\n');
    }

    console.log('='.repeat(70));
}

runHealthCheck().catch(console.error);
