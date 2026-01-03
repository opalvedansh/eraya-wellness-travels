import { createClient } from '@supabase/supabase-js';
import logger from './logger';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// For development, we can use the anon key if service role key is not set
const SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    logger.warn('Supabase configuration missing. Authentication will not work properly.');
}

// Create Supabase client for server-side operations
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

/**
 * Verify a Supabase JWT token and extract user information
 */
export async function verifySupabaseToken(token: string): Promise<{ userId: string; email: string } | null> {
    try {
        // Verify the token with Supabase
        const { data: { user }, error } = await (supabaseAdmin.auth as any).getUser(token);

        if (error || !user) {
            logger.warn('Invalid Supabase token', { error: error?.message });
            return null;
        }

        logger.debug('Supabase token verified', { userId: user.id, email: user.email });

        return {
            userId: user.id,
            email: user.email || '',
        };
    } catch (error) {
        logger.error('Supabase token verification failed', {
            error: error instanceof Error ? error.message : String(error),
        });
        return null;
    }
}
