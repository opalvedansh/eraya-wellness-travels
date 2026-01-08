import { supabase } from "@/lib/supabaseClient";
import { API_BASE_URL } from "./config";

/**
 * Make an authenticated API call with Supabase token
 */
export async function authenticatedFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    // Get current Supabase session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
        throw new Error("No active session");
    }

    // Add Authorization header with Supabase token
    // Don't set Content-Type for FormData - let browser set it with boundary
    const baseHeaders: HeadersInit = {
        Authorization: `Bearer ${session.access_token}`,
    };

    // Only add Content-Type: application/json if headers are not explicitly set to undefined (FormData case)
    const headers: HeadersInit =
        options.headers === undefined
            ? baseHeaders  // FormData: don't set Content-Type
            : {
                ...baseHeaders,
                ...options.headers,
                "Content-Type": "application/json",
            };

    console.log(`[API] Fetching: ${fullUrl}`);
    return fetch(fullUrl, {
        ...options,
        headers,
        credentials: "include",
    });
}
