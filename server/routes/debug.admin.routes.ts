import { Router, Request, Response } from "express";
import { prisma } from "../services/prisma";
import logger from "../services/logger";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Protected debug endpoint - requires valid token but bypasses requireAdmin for initial check
router.get("/debug-db", authenticate, async (req: Request, res: Response) => {
    const requestId = Math.random().toString(36).substring(7);
    const results: any = {
        requestId,
        timestamp: new Date().toISOString(),
        auth: {
            user: req.user,
            isAuthenticated: !!req.user
        },
        tests: {}
    };

    try {
        // Test 1: Raw Query
        try {
            const start = Date.now();
            await prisma.$queryRaw`SELECT 1`;
            results.tests.rawQuery = {
                status: 'success',
                duration: `${Date.now() - start}ms`
            };
        } catch (e) {
            results.tests.rawQuery = {
                status: 'failed',
                error: e instanceof Error ? e.message : String(e)
            };
        }

        // Test 2: User Lookup (simulating requireAdmin)
        if (req.user?.userId) {
            try {
                const start = Date.now();
                const user = await prisma.user.findUnique({
                    where: { id: req.user.userId },
                    select: { id: true, email: true, isAdmin: true }
                });

                results.tests.userLookup = {
                    status: 'success',
                    duration: `${Date.now() - start}ms`,
                    found: !!user,
                    isAdmin: user?.isAdmin
                };
            } catch (e) {
                results.tests.userLookup = {
                    status: 'failed',
                    error: e instanceof Error ? e.message : String(e)
                };
            }
        } else {
            results.tests.userLookup = {
                status: 'skipped',
                reason: 'No userId in request'
            };
        }

        logger.info(`[DebugDB:${requestId}] Diagnostic run completed`);
        res.json(results);

    } catch (error) {
        logger.error(`[DebugDB:${requestId}] Critical failure`, { error });
        res.status(500).json({
            error: "Debug execution failed",
            details: error instanceof Error ? error.message : String(error),
            partialResults: results
        });
    }
});

export default router;
