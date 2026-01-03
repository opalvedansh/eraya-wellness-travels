/**
 * Vercel Serverless Function
 * This file wraps the Express server to work as a Vercel serverless function
 */
import { createServer } from "./server";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Create the Express app
const app = createServer();

// Export the serverless handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Forward the request to the Express app
    return new Promise((resolve, reject) => {
        app(req as any, res as any, (err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(undefined);
            }
        });
    });
}
