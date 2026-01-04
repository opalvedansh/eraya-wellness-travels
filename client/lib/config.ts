/**
 * Application Configuration
 */

// API Base URL - empty string for local dev (proxy), full URL for production
export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

console.log("[Config] Loaded API_BASE_URL:", API_BASE_URL);
