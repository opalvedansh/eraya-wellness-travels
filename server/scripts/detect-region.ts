#!/usr/bin/env node

import * as net from 'net';

const projectRef = 'uznouhdvxggwcrekufnf';
const possibleRegions = [
    'us-east-1',
    'us-west-1',
    'us-west-2',
    'eu-west-1',
    'eu-west-2',
    'eu-central-1',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-1',
    'sa-east-1'
];

console.log('\n' + '='.repeat(70));
console.log('🌍 DETECTING SUPABASE REGION');
console.log('='.repeat(70));
console.log(`\nProject: ${projectRef}`);
console.log(`Testing ${possibleRegions.length} possible regions...\n`);

async function testRegion(region: string): Promise<boolean> {
    return new Promise((resolve) => {
        const host = `aws-0-${region}.pooler.supabase.com`;

        const socket = net.createConnection({
            host: host,
            port: 6543,
            timeout: 3000
        });

        socket.on('connect', () => {
            console.log(`✅ ${region.padEnd(20)} - ACCESSIBLE`);
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            console.log(`❌ ${region.padEnd(20)} - Timeout`);
            socket.destroy();
            resolve(false);
        });

        socket.on('error', () => {
            console.log(`❌ ${region.padEnd(20)} - Not accessible`);
            socket.destroy();
            resolve(false);
        });
    });
}

async function detectRegion() {
    const results: { region: string; accessible: boolean }[] = [];

    for (const region of possibleRegions) {
        const accessible = await testRegion(region);
        results.push({ region, accessible });

        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n' + '='.repeat(70));
    console.log('📊 RESULTS');
    console.log('='.repeat(70));

    const accessibleRegions = results.filter(r => r.accessible);

    if (accessibleRegions.length > 0) {
        console.log('\n✅ Found accessible region(s):\n');
        accessibleRegions.forEach(r => {
            console.log(`   ${r.region}`);
        });

        const detectedRegion = accessibleRegions[0].region;

        console.log('\n' + '='.repeat(70));
        console.log('🔧 USE THIS DATABASE_URL:');
        console.log('='.repeat(70));
        console.log('\nFor your .env file:\n');
        console.log(`DATABASE_URL="postgresql://postgres.${projectRef}:[YOUR-PASSWORD]@aws-0-${detectedRegion}.pooler.supabase.com:6543/postgres?pgbouncer=true"\n`);
        console.log('Replace [YOUR-PASSWORD] with your actual database password');
        console.log('(Get password from: Supabase Dashboard → Settings → Database)\n');
        console.log('='.repeat(70));

    } else {
        console.log('\n❌ No accessible regions found!\n');
        console.log('This could mean:');
        console.log('  1. Your Supabase project is paused');
        console.log('  2. Your project uses a different region not in our list');
        console.log('  3. Network/firewall is blocking connections\n');
        console.log('🔧 SOLUTION:');
        console.log('  Go to Supabase Dashboard → Settings → Database');
        console.log('  Copy the exact connection string from there\n');
        console.log('  URL: https://supabase.com/dashboard/project/' + projectRef + '/settings/database\n');
    }
}

detectRegion().catch(console.error);
