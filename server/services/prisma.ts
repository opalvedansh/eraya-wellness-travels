import { PrismaClient } from "@prisma/client";

/**
 * Robustly sanitizes and configures the Database URL
 * Handles missing protocols, pgbouncer settings, and SSL modes
 */
function sanitizeDatabaseUrl(url: string | undefined): string {
    if (!url) {
        console.warn("DATABASE_URL environment variable is not defined. Using dummy URL for build.");
        return "postgresql://dummy:dummy@localhost:5432/dummy";
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

const prismaClientSingleton = () => {
    const databaseUrl = sanitizeDatabaseUrl(process.env.DATABASE_URL);

    return new PrismaClient({
        datasources: {
            db: {
                url: databaseUrl,
            },
        },
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

// Backward compatibility helper
export const initializePrisma = async () => {
    // In serverless, we don't strictly need to await connect() as the first query will do it,
    // but it's good for health checks.
    // However, avoid top-level await issues.
    return prisma;
};

// Backward compatibility helper
export const isPrismaReady = () => true;
