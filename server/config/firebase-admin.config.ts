import admin from "firebase-admin";
import logger from "../services/logger";

let firebaseAdmin: admin.app.App | null = null;

/**
 * Initialize Firebase Admin SDK
 * Uses service account credentials from environment variable
 */
export function initializeFirebaseAdmin(): admin.app.App {
    if (firebaseAdmin) {
        return firebaseAdmin;
    }

    try {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (!serviceAccountKey) {
            throw new Error(
                "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set"
            );
        }

        // Parse the service account JSON
        const serviceAccount = JSON.parse(serviceAccountKey);

        firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        logger.info("Firebase Admin SDK initialized successfully");
        return firebaseAdmin;
    } catch (error) {
        logger.error("Failed to initialize Firebase Admin SDK:", error);
        throw new Error(
            `Firebase Admin initialization failed: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

/**
 * Get Firebase Admin Auth instance
 */
export function getFirebaseAuth(): admin.auth.Auth {
    if (!firebaseAdmin) {
        firebaseAdmin = initializeFirebaseAdmin();
    }
    return firebaseAdmin.auth();
}

/**
 * Verify Firebase ID token
 * @param idToken - Firebase ID token from client
 * @returns Decoded token with user information
 */
export async function verifyFirebaseToken(idToken: string) {
    try {
        const auth = getFirebaseAuth();
        const decodedToken = await auth.verifyIdToken(idToken);
        return {
            success: true,
            decodedToken,
        };
    } catch (error) {
        logger.error("Firebase token verification failed:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Token verification failed",
        };
    }
}

export default { initializeFirebaseAdmin, getFirebaseAuth, verifyFirebaseToken };
