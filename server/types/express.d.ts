import "express-serve-static-core";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            userId: string;
            email: string;
            sessionId?: string;
        };
        file?: Express.Multer.File;
        files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    }
}
