import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

let prismaInstance: any = null;
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

        if (!databaseUrl) {
            throw new Error("DATABASE_URL environment variable is required");
        }

        // Dynamic import to avoid vite config loading issues
        const { PrismaClient } = await import("../../generated/prisma/client.js");

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
export const prisma = new Proxy({} as any, {
    get(target, prop) {
        if (!prismaInstance) {
            throw new Error("Prisma client not initialized. Call getPrismaClient() first or await initialization.");
        }
        return prismaInstance[prop];
    }
});

// Initialize in background but don't crash if DATABASE_URL is missing
// This allows the server to start even if database is not configured
if (process.env.DATABASE_URL) {
    getPrismaClient().catch(err => {
        console.error("Background Prisma initialization failed:", err);
    });
} else {
    console.warn("DATABASE_URL not set - database features will not be available");
}
