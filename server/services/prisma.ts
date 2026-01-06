import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient | null = null;
let isInitializing = false;

/**
 * Robustly sanitizes and configures the Database URL
 * Handles missing protocols, pgbouncer settings, and SSL modes
 */
function sanitizeDatabaseUrl(url: string | undefined): string {
    if (!url) {
        throw new Error("DATABASE_URL environment variable is required");
    }

    let sanitized = url.trim();

    // 1. Fix Protocol
    if (!sanitized.startsWith("postgresql://") && !sanitized.startsWith("postgres://")) {
        console.log("[Prisma] Fixing missing protocol: Prepending 'postgresql://'");
        sanitized = `postgresql://${sanitized}`;
    }

    try {
        const urlObj = new URL(sanitized);

        // 2. Log Connection Details (Generic/Safe)
        console.log(`[Prisma] Config: Host=${urlObj.hostname} Port=${urlObj.port} User=${urlObj.username} DB=${urlObj.pathname.substring(1)}`);

        // 3. Auto-configure for Supabase Transaction Pooler (Port 6543)
        // If port is 6543, we MUST use pgbouncer=true for Prisma to work correctly with prepared statements
        if (urlObj.port === "6543" && !urlObj.searchParams.has("pgbouncer")) {
            console.log("[Prisma] Detected Supabase Transaction Pooler (Port 6543). Adding ?pgbouncer=true");
            urlObj.searchParams.set("pgbouncer", "true");
        }

        // 4. Ensure SSL/Pool constraints
        if (!urlObj.searchParams.has("sslmode")) {
            urlObj.searchParams.set("sslmode", "require");
        }

        // Return the reconstructed string
        return urlObj.toString();

    } catch (error) {
        console.error("[Prisma] Failed to parse/sanitize URL. Using original string.", error);
        // Fallback: Use the original (with protocol fix) if parsing failed
        return sanitized;
    }
}

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
        // ENHANCED DEBUG: Log environment variable status
        console.log(`[Prisma] NODE_ENV: ${process.env.NODE_ENV}`);

        const databaseUrl = sanitizeDatabaseUrl(process.env.DATABASE_URL);

        // Standard Prisma Client initialization
        prismaInstance = new PrismaClient({
            datasources: {
                db: {
                    url: databaseUrl,
                },
            },
            log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
        });

        // Graceful shutdown
        const cleanup = async () => {
            if (prismaInstance) {
                await prismaInstance.$disconnect();
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
            // If accessed before initialization, try to return current instance or throw
            if (prismaInstance) return prismaInstance[prop as keyof PrismaClient];
            // Allow access to $queryRaw etc if instance exists, otherwise it might throw
            // But usually index.ts calls initializePrisma first.
        }
        // If still null, it will likely lose strict type safety or throw runtime error
        // But preventing crash allows checking isPrismaReady()
        return prismaInstance ? prismaInstance[prop as keyof PrismaClient] : undefined;
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
