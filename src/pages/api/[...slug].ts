import { createServer } from '../../../server/index';
import type { NextApiRequest, NextApiResponse } from 'next';

// Cache the app instance to avoid recreating it on every request (warm start)
let app: any = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!app) {
        app = createServer();
    }

    // We need to disable the body parser in Next.js because Express handles it.
    // However, Next.js Pages API routes parse body by default.
    // We disable it in the config below.

    return new Promise((resolve, reject) => {
        // app is an Express instance, which is a request listener (req, res, next)
        // It works with standard Node.js http.IncomingMessage and http.ServerResponse
        // NextApiRequest and NextApiResponse extend these.
        app(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            resolve(result);
        });
    });
}

export const config = {
    api: {
        bodyParser: false, // Disallow Next.js body parsing, let Express handle it
        externalResolver: true, // Tells Next.js that this route is handled by an external resolver (Express)
    },
};
