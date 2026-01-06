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

        if (!databaseUrl) {
            throw new Error("DATABASE_URL environment variable is required");
        }

        // Standard Prisma Client initialization
        // This natively supports the postgresql:// protocol in DATABASE_URL
        prismaInstance = new PrismaClient({
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
