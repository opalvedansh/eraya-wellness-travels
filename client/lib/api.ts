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
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
    };

    console.log(`[API] Fetching: ${fullUrl}`);
    return fetch(fullUrl, {
        ...options,
        headers,
        credentials: "include",
    });
}
