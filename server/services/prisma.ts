import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient | null = null;
let isInitializing = false;

export async function getPrismaClient() {
    // If already initialized, return it
    if (prismaInstance) {
        return prismaInstance;
    }

    // If currently initializing, wait for it
    if (isInitializing) {
        while (!prismaInstance) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return prismaInstance;
    }

    isInitializing = true;

    try {
        const databaseUrl = process.env.DATABASE_URL;

        // ENHANCED DEBUG: Log environment variable status
        console.log(`[Prisma] NODE_ENV: ${process.env.NODE_ENV}`);
        console.log(`[Prisma] DATABASE_URL exists: ${!!databaseUrl}`);
        console.log(`[Prisma] DATABASE_URL length: ${databaseUrl?.length || 0}`);
        console.log(`[Prisma] DATABASE_URL starts with: ${databaseUrl?.substring(0, 30)}...`);

        if (!databaseUrl) {
            throw new Error("DATABASE_URL environment variable is required");
        }

        // DEBUG: Log the host portion of DATABASE_URL to diagnose connection issues
        try {
            const url = new URL(databaseUrl);
            console.log(`[Prisma] Connecting to database host: ${url.hostname}:${url.port}`);
            console.log(`[Prisma] Database name: ${url.pathname}`);

            // CRITICAL: Check for localhost in production
            if (process.env.NODE_ENV === 'production') {
                const hostname = url.hostname.toLowerCase();
                if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
                    console.error('\n\n❌ CRITICAL MISCONFIGURATION DETECTED ❌');
                    console.error('The application is running in PRODUCTION mode but is configured to connect to a LOCALHOST database.');
                    console.error('This means the backend is trying to connect to itself instead of your Supabase database.');
                    console.error('Current DATABASE_URL host:', hostname);
                    console.error('👉 ACTION REQUIRED: Go to Railway Dashboard > Variables and update DATABASE_URL to your actual Supabase connection string.\n\n');
                }
            }
        } catch (parseError) {
            console.log(`[Prisma] DATABASE_URL format check failed:`, parseError);
        }

        // Prisma 7 with pg adapter
        const pool = new pg.Pool({ connectionString: databaseUrl });
        const adapter = new PrismaPg(pool);

        prismaInstance = new PrismaClient({
            adapter,
            log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
        });

        // Graceful shutdown
        const cleanup = async () => {
            if (prismaInstance) {
                await prismaInstance.$disconnect();
                await pool.end();
                prismaInstance = null;
            }
        };

        process.on("SIGINT", cleanup);
        process.on("SIGTERM", cleanup);
        process.on("beforeExit", cleanup);

        isInitializing = false;
        return prismaInstance;
    } catch (error) {
        isInitializing = false;
        console.error("Failed to initialize Prisma client:", error);
        throw error;
    }
}

// Create a proxy object that will initialize on first use
export const prisma = new Proxy({} as PrismaClient, {
    get(target, prop) {
        if (!prismaInstance) {
            throw new Error("Prisma client not initialized. Call initializePrisma() at server startup.");
        }
        return prismaInstance[prop as keyof PrismaClient];
    }
});

// Initialization promise for startup wait
let initPromise: Promise<PrismaClient> | null = null;

/**
 * Initialize Prisma client - call this at server startup and await it
 * before starting to accept requests.
 */
export function initializePrisma(): Promise<PrismaClient> {
    if (!process.env.DATABASE_URL) {
        return Promise.reject(new Error("DATABASE_URL environment variable is required"));
    }
    if (!initPromise) {
        initPromise = getPrismaClient();
    }
    return initPromise;
}

/**
 * Check if Prisma is ready (for health checks, etc.)
 */
export function isPrismaReady(): boolean {
    return prismaInstance !== null;
}
