import { NextResponse } from 'next/server';
import { cleanupExpiredSessions } from '@/../server/services/jwt';
import { cleanupExpiredTokens } from '@/../server/services/otp';

// Route handler for Vercel Cron
// Configure this in vercel.json
export async function GET(request: Request) {
    // Verify authorization header to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        await Promise.all([
            cleanupExpiredSessions(),
            cleanupExpiredTokens(),
        ]);

        return NextResponse.json({ success: true, message: 'Cleanup completed' });
    } catch (error) {
        console.error('Cleanup failed:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
