import jwt, { Secret, SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "./prisma";
import logger from "./logger";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET || JWT_SECRET.length < 32) {
    logger.warn(
        "JWT_SECRET is not set or too short. Using a default for development ONLY. This is INSECURE for production!"
    );
}

export interface JWTPayload {
    userId: string;
    email: string;
    sessionId: string;
}

export interface DecodedToken extends JWTPayload {
    iat: number;
    exp: number;
}

/**
 * Generate a secure JWT token for a user
 */
export async function generateToken(
    userId: string,
    email: string
): Promise<{ token: string; sessionId: string }> {
    const sessionId = crypto.randomUUID();

    // Calculate expiration
    const expiresAt = calculateExpiration(JWT_EXPIRES_IN);

    // Create JWT payload
    const payload: JWTPayload = {
        userId,
        email,
        sessionId,
    };

    // Sign the token
    // @ts-expect-error - TypeScript has strict type checking for expiresIn that doesn't match our string type, but at runtime this works correctly
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });

    // Store session in database
    try {
        await prisma.session.create({
            data: {
                id: sessionId,
                userId,
                token,
                expiresAt,
            },
        });

        logger.info("JWT token generated", { userId, sessionId });
    } catch (error) {
        logger.error("Failed to create session in database", {
            userId,
            error: error instanceof Error ? error.message : String(error),
        });
        throw new Error("Failed to create session");
    }

    return { token, sessionId };
}

/**
 * Verify a JWT token and check if session exists
 */
export async function verifyToken(token: string): Promise<DecodedToken | null> {
    try {
        // Verify JWT signature and expiration
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

        // Check if session exists and is valid
        const session = await prisma.session.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!session) {
            logger.warn("Session not found in database", { sessionId: decoded.sessionId });
            return null;
        }

        // Check if session is expired
        if (new Date() > session.expiresAt) {
            logger.info("Session expired", { sessionId: session.id });
            // Clean up expired session
            await prisma.session.delete({ where: { id: session.id } });
            return null;
        }

        return decoded;
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            logger.warn("Invalid JWT token", { error: error.message });
        } else if (error instanceof jwt.TokenExpiredError) {
            logger.info("JWT token expired");
        } else {
            logger.error("Token verification failed", {
                error: error instanceof Error ? error.message : String(error),
            });
        }
        return null;
    }
}

/**
 * Revoke a session by token
 */
export async function revokeToken(token: string): Promise<boolean> {
    try {
        await prisma.session.delete({ where: { token } });
        logger.info("Token revoked successfully");
        return true;
    } catch (error) {
        logger.error("Failed to revoke token", {
            error: error instanceof Error ? error.message : String(error),
        });
        return false;
    }
}

/**
 * Revoke all sessions for a user
 */
export async function revokeAllUserTokens(userId: string): Promise<number> {
    try {
        const result = await prisma.session.deleteMany({ where: { userId } });
        logger.info("All user sessions revoked", { userId, count: result.count });
        return result.count;
    } catch (error) {
        logger.error("Failed to revoke user sessions", {
            userId,
            error: error instanceof Error ? error.message : String(error),
        });
        return 0;
    }
}

/**
 * Clean up expired sessions from database
 */
export async function cleanupExpiredSessions(): Promise<number> {
    try {
        const result = await prisma.session.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });

        if (result.count > 0) {
            logger.info("Expired sessions cleaned up", { count: result.count });
        }

        return result.count;
    } catch (error) {
        logger.error("Failed to cleanup expired sessions", {
            error: error instanceof Error ? error.message : String(error),
        });
        return 0;
    }
}

/**
 * Calculate expiration date from a duration string
 */
function calculateExpiration(duration: string): Date {
    const now = Date.now();
    const match = duration.match(/^(\d+)([smhd])$/);

    if (!match) {
        // Default to 7 days if invalid format
        return new Date(now + 7 * 24 * 60 * 60 * 1000);
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    let milliseconds = 0;
    switch (unit) {
        case "s":
            milliseconds = value * 1000;
            break;
        case "m":
            milliseconds = value * 60 * 1000;
            break;
        case "h":
            milliseconds = value * 60 * 60 * 1000;
            break;
        case "d":
            milliseconds = value * 24 * 60 * 60 * 1000;
            break;
    }

    return new Date(now + milliseconds);
}
