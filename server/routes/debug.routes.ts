import { Router, Request, Response } from "express";
import pg from "pg";

const router = Router();

router.get("/debug-db", async (req: Request, res: Response) => {
    const dbUrl = process.env.DATABASE_URL;

    const report: any = {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!dbUrl,
        parsed: {},
        connectionTest: "Pending"
    };

    if (!dbUrl) {
        report.error = "DATABASE_URL is missing";
        return res.json(report);
    }

    // Parse URL safely
    try {
        const url = new URL(dbUrl);
        report.parsed = {
            protocol: url.protocol,
            host: url.host,
            hostname: url.hostname, // This is what matters!
            port: url.port,
            pathname: url.pathname,
            // DO NOT LOG PASSWORD or partial url
        };
    } catch (e) {
        report.parsed = { error: "Failed to parse URL string" };
        report.rawValueStart = dbUrl.substring(0, 5); // Just to check for quotes
    }

    // Try raw connection
    const pool = new pg.Pool({
        connectionString: dbUrl,
        connectionTimeoutMillis: 3000, // Fail fast
    });

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        report.connectionTest = "SUCCESS";
        report.dbTime = result.rows[0];
        client.release();
    } catch (err: any) {
        report.connectionTest = "FAILED";
        report.connectError = {
            message: err.message,
            code: err.code,
            address: err.address, // Will show ::1 if localhost
            port: err.port
        };
    } finally {
        await pool.end();
    }

    res.json(report);
});

export default router;
